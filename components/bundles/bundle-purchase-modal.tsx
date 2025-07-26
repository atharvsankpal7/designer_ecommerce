'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Package, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface BundlePurchaseModalProps {
  bundle: {
    id: string;
    name: string;
    originalPrice: number;
    discountPrice?: number;
    products: Array<{
      id: string;
      title: string;
    }>;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BundlePurchaseModal({ bundle, isOpen, onClose }: BundlePurchaseModalProps) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'payment'>('email');
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/purchase/bundle/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, bundleId: bundle?.id }),
      });

      if (response.ok) {
        setStep('verify');
        toast.success('Verification code sent to your email');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to send verification code');
      }
    } catch (error : any) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error('Verification code must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/purchase/bundle/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, bundleId: bundle?.id }),
      });

      if (response.ok) {
        setStep('payment');
        toast.success('Email verified successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Invalid verification code');
      }
    } catch (error : any) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/purchase/bundle/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, bundleId: bundle?.id }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Initialize Razorpay
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: 'INR',
            name: 'SS Creation',
            description: `Bundle: ${data.bundleName}`,
            order_id: data.orderId,
            handler: async (response: any) => {
              // Verify payment
              const verifyResponse = await fetch('/api/purchase/bundle/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.orderId,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });

              if (verifyResponse.ok) {
                toast.success('Payment successful! Bundle files will be sent to your email.');
                onClose();
              } else {
                const errorData = await verifyResponse.json();
                toast.error(errorData.error || 'Payment verification failed');
              }
            },
            prefill: {
              email: email,
            },
            theme: {
              color: '#059669', // Emerald color for bundles
            },
            modal: {
              ondismiss: () => {
                setLoading(false);
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        toast.error(data.error || 'Failed to create order');
      }
    } catch (error : any) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setEmail('');
    setVerificationCode('');
    setStep('email');
  };

  const finalPrice = bundle?.discountPrice || bundle?.originalPrice || 0;
  const savings = bundle?.discountPrice ? bundle.originalPrice - bundle.discountPrice : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetModal();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-emerald-600" />
            Purchase Bundle
          </DialogTitle>
        </DialogHeader>

        {bundle && (
          <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h3 className="font-semibold text-emerald-900 mb-2">{bundle.name}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-emerald-600">
                ₹{finalPrice.toLocaleString()}
              </span>
              {savings > 0 && (
                <Badge className="bg-red-100 text-red-700">
                  Save ₹{savings.toLocaleString()}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-emerald-700">
              <Package className="h-4 w-4 mr-1" />
              {bundle.products.length} premium designs included
            </div>
          </div>
        )}

        {step === 'email' && (
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                Secure purchase with email verification
              </span>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <Button onClick={handleSendVerification} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-sm text-amber-800">
                Code expires in 10 minutes
              </span>
            </div>
            
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="mt-1 text-center text-lg tracking-widest"
              />
            </div>
            <Button onClick={handleVerifyCode} disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setStep('email')} 
              className="w-full"
            >
              Change Email
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Ready to Purchase</span>
              </div>
              <p className="text-green-700">
                Amount: ₹{finalPrice.toLocaleString()}
              </p>
              {savings > 0 && (
                <p className="text-sm text-green-600">
                  You're saving ₹{savings.toLocaleString()}!
                </p>
              )}
            </div>
            <Button onClick={handlePayment} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setStep('verify')} 
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}