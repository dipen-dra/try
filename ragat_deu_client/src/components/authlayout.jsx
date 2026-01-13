import { Award, Globe, Heart, Shield, Users } from "lucide-react"

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Main Content Container */}
      <div className="w-full max-w-6xl mx-auto flex shadow-2xl rounded-2xl overflow-hidden bg-white max-h-[95vh] h-[800px]">
        {/* Left side - Form (NOW SCROLLABLE) */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Right side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 to-teal-600 flex-col items-center justify-center p-8 text-white relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-16 -left-12 w-48 h-48 bg-white/10 rounded-full"></div>

          <div className="text-center space-y-8 z-10">
            {/* Header */}
            <div className="flex items-center justify-center space-x-3">
              <Heart className="w-10 h-10 text-white fill-current" />
              <h1 className="text-4xl font-bold">Hope Care</h1>
            </div>

            <p className="text-xl font-light text-white/90">
              Connecting hearts, changing lives through the power of giving
            </p>

            {/* Quote */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm italic">
                "Every donation creates a ripple of hope that transforms communities and saves lives"
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/15 rounded-lg p-4 text-center">
                <Shield className="w-7 h-7 mx-auto mb-2" />
                <p className="font-semibold">Secure</p>
                <p className="text-xs text-white/80">Donations</p>
              </div>
              <div className="bg-white/15 rounded-lg p-4 text-center">
                <Globe className="w-7 h-7 mx-auto mb-2" />
                <p className="font-semibold">Global</p>
                <p className="text-xs text-white/80">Impact</p>
              </div>
              <div className="bg-white/15 rounded-lg p-4 text-center">
                <Users className="w-7 h-7 mx-auto mb-2" />
                <p className="font-semibold">Community</p>
                <p className="text-xs text-white/80">Driven</p>
              </div>
              <div className="bg-white/15 rounded-lg p-4 text-center">
                <Award className="w-7 h-7 mx-auto mb-2" />
                <p className="font-semibold">Trusted</p>
                <p className="text-xs text-white/80">Platform</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-around items-center pt-4 border-t border-white/20">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-xs text-white/80">Donors</p>
              </div>
              <div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-xs text-white/80">Lives Touched</p>
              </div>
              <div>
                <p className="text-2xl font-bold">100+</p>
                <p className="text-xs text-white/80">Communities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
