import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Users,
  BarChart3,
  Star,
  Quote,
  Database,
  Cpu,
  Globe,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              🚀 Now with Advanced AI Models
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Generate Synthetic Data
              <br />
              <span className="text-foreground">That Actually Works</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Create high-quality, privacy-safe synthetic datasets with our
              AI-powered platform. Perfect for testing, training, and
              development without compromising real data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/wizard">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-xl"
                >
                  Start Building Dataset
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 rounded-xl"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Synthetic Data
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to
              make synthetic data generation accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  Lightning Fast Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate thousands of records in seconds with our optimized AI
                  algorithms. No more waiting hours for your data.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Privacy & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  GDPR, CCPA, and HIPAA compliant synthetic data that maintains
                  statistical properties while protecting individual privacy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Multiple Data Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Support for tabular, time-series, text, and image data. One
                  platform for all your synthetic data needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Advanced AI Models</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Powered by state-of-the-art generative models including GANs,
                  VAEs, and transformer-based architectures.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share datasets, collaborate on projects, and manage team
                  access with enterprise-grade security features.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seamlessly integrate with your existing workflows through our
                  comprehensive REST API and SDK libraries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers say about their experience with SagaSynth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6">
                  "SagaSynth has revolutionized our testing process. We can now
                  generate realistic test data without worrying about privacy
                  compliance."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-primary">
                      SJ
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">
                      CTO, TechCorp
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6">
                  "The quality of synthetic data is incredible. Our ML models
                  perform just as well on synthetic data as they do on real
                  data."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-primary">
                      MR
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Michael Rodriguez</div>
                    <div className="text-sm text-muted-foreground">
                      Data Scientist, AI Labs
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6">
                  "Easy to use, fast generation, and excellent customer support.
                  SagaSynth is now an essential part of our development
                  toolkit."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-primary">
                      EL
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Emily Chen</div>
                    <div className="text-sm text-muted-foreground">
                      Product Manager, StartupXYZ
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              By the Numbers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powering Innovation Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Datasets Generated</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">5K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">10M+</div>
              <div className="text-muted-foreground">Records Created</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Enhanced CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Data Strategy?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and data scientists who trust
              SagaSynth for their synthetic data needs. Start your free trial
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/wizard">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-xl"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-xl"
              >
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link
                to="/"
                className="text-2xl font-bold text-primary mb-4 inline-block"
              >
                SagaSynth
              </Link>
              <p className="text-muted-foreground mb-4 max-w-md">
                The leading platform for generating high-quality synthetic data.
                Trusted by developers and data scientists worldwide.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm">
                  LinkedIn
                </Button>
                <Button variant="ghost" size="sm">
                  GitHub
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <Link
                  to="/wizard"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Data Generator
                </Link>
                <Link
                  to="/marketplace"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Marketplace
                </Link>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  API Documentation
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </a>
                <a
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SagaSynth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
