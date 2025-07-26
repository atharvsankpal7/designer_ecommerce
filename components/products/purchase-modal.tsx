'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PurchaseModalProps {
  product: {
    id: string;
    title: string;
    originalPrice: number;
    discountPrice?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseModal({ product, isOpen, onClose }: PurchaseModalProps) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'payment'>('email');
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/purchase/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId: product?.id }),
      });

      if (response.ok) {
        setStep('verify');
        toast.success('Verification code sent to your email');
      } else {
        toast.error('Failed to send verification code');
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

    setLoading(true);
    try {
      const response = await fetch('/api/purchase/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, productId: product?.id }),
      });

      if (response.ok) {
        setStep('payment');
        toast.success('Email verified successfully');
      } else {
        toast.error('Invalid verification code');
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
      const response = await fetch('/api/purchase/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId: product?.id }),
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
            description: product?.title,
            order_id: data.orderId,
            handler: async (response: any) => {
              // Verify payment
              const verifyResponse = await fetch('/api/purchase/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.orderId,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });

              if (verifyResponse.ok) {
                toast.success('Payment successful! Files will be sent to your email.');
                onClose();
              } else {
                toast.error('Payment verification failed');
              }
            },
            theme: {
              color: '#3B82F6',
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        toast.error('Failed to create order');
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetModal();
        onClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {product?.title}</DialogTitle>
        </DialogHeader>

        {step === 'email' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <Button onClick={handleSendVerification} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
              />
            </div>
            <Button onClick={handleVerifyCode} disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold">Ready to Purchase</p>
              <p className="text-gray-600">
                Amount: ₹{product?.discountPrice || product?.originalPrice}
              </p>
            </div>
            <Button onClick={handlePayment} disabled={loading} className="w-full">
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}