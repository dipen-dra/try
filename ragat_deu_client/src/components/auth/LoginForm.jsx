"use client";
import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLogin } from "../../hooks/useLoginUserTan";
import { Droplet, Mail, Lock } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-hot-toast';

const LoginForm = () => {
    const { mutate: attemptLogin, isPending } = useLogin();
    const recaptchaRef = useRef(null);

    const formik = useFormik({
        initialValues: { email: "", password: "", rememberMe: false },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        }),
        onSubmit: (values) => {
            const recaptchaToken = recaptchaRef.current.getValue();
            if (!recaptchaToken) {
                toast.error("Please complete the reCAPTCHA verification.");
                return;
            }

            attemptLogin({
                email: values.email,
                password: values.password,
                "g-recaptcha-response": recaptchaToken
            });

            recaptchaRef.current.reset();
        },
    });

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8 relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blood-500 via-blood-600 to-blood-700 rounded-2xl shadow-xl mb-4">
                    <Droplet className="w-8 h-8 text-white fill-white" />
                </div>
                <h1 className="text-3xl font-bold text-navy-500">Welcome Back</h1>
                <p className="text-gray-500">Continue your journey of saving lives</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Email and Password fields remain the same */}
                <div className="space-y-1">
                    <label className="block text-sm font-semibold">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-400" /></div>
                        <input
                            type="email"
                            name="email"
                            {...formik.getFieldProps('email')}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-3 py-3 border-2 rounded-xl"
                        />
                    </div>
                    {formik.touched.email && formik.errors.email && <div className="text-red-600 text-xs mt-1">{formik.errors.email}</div>}
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-semibold">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-gray-400" /></div>
                        <input
                            type="password"
                            name="password"
                            {...formik.getFieldProps('password')}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-3 py-3 border-2 rounded-xl"
                        />
                    </div>
                    {formik.touched.password && formik.errors.password && <div className="text-red-600 text-xs mt-1">{formik.errors.password}</div>}
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="rememberMe" {...formik.getFieldProps('rememberMe')} />
                        <span>Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-blood-600 hover:text-blood-700">Forgot password?</Link>
                </div>

                {/* ## Add the ReCAPTCHA component here ## */}
                <div className="flex justify-center">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-6 py-3 bg-blood-600 hover:bg-blood-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Signing you in..." : "Sign In"}
                </button>
            </form>
            <div className="text-center mt-6 pt-4 border-t">
                <p>New to our community? <Link to="/signup" className="font-semibold text-blood-600 hover:text-blood-700">Join us today</Link></p>
            </div>
        </div>
    );
};

export default LoginForm;

