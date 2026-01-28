const express = require('express');
const axios = require('axios');
const router = express.Router();
const Donation = require('../model/Donation');
const Request = require('../model/Request');
const { sendNotificationToUser } = require('../services/notificationServices');
const { sendMail } = require('../services/emailService');
const donationController = require('../controller/donationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/khalti-payment-initiate', async (req, res) => {
  try {
    const {
      return_url,
      website_url,
      amount,
      purchase_order_id,
      purchase_order_name,
      customer_info
    } = req.body;

    // Extract campaignId from purchase_order_id (Order_campaignId_Date.now)
    const campaignId = purchase_order_id.split('_')[1];

    const response = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/initiate/',
      {
        return_url,
        website_url,
        amount,
        purchase_order_id,
        purchase_order_name,
        customer_info
      },
      {
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY || '9268968c84424268ae42b83fb7419450'}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.pidx) {
      // Save pending donation
      const donation = new Donation({
        campaignId,
        amount: amount / 100, // Convert paisa to main currency
        donorName: customer_info.name,
        donorEmail: customer_info.email,
        isAnonymous: customer_info.name === 'Anonymous',
        paymentGateway: 'Khalti',
        transactionId: response.data.pidx, // Temporarily store pidx to link later
        paymentStatus: 'pending'
      });
      await donation.save();
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Khalti API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Khalti payment initiation failed." });
  }
});

router.post('/khalti-verify', async (req, res) => {
  const { pidx } = req.body;
  try {
    const response = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY || '9268968c84424268ae42b83fb7419450'}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status === 'Completed') {
      const donation = await Donation.findOne({ transactionId: pidx });
      if (donation && donation.paymentStatus !== 'success') {
        donation.paymentStatus = 'success';
        await donation.save();

        // Update Request stats
        const campaign = await Request.findById(donation.campaignId);
        if (campaign) {
          campaign.raisedAmount = (campaign.raisedAmount || 0) + donation.amount;
          campaign.donorsCount = (campaign.donorsCount || 0) + 1;
          await campaign.save();
        }

        return res.json({ success: true, message: "Payment verified and stats updated." });
      } else if (donation && donation.paymentStatus === 'success') {
        return res.json({ success: true, message: "Payment already verified." });
      }
    }
    res.status(400).json({ success: false, message: "Payment not completed or verification failed." });
  } catch (error) {
    console.error("Khalti Verification Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Verification failed." });
  }
});



// Admin: List donations
router.get('/admin/list', authMiddleware.authorizeToken, authMiddleware.requireAdmin, donationController.listDonations);
// Admin: Export donations as CSV
router.get('/admin/export', authMiddleware.authorizeToken, authMiddleware.requireAdmin, donationController.exportDonations);

module.exports = router;