import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, analytics, logEvent } from '../firebase';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            
            // Log password reset event to Firebase Analytics
            logEvent(analytics, 'password_reset_email_sent', {
                method: 'email'
            });
            
            setSuccess('Password reset email sent! Check your inbox for further instructions.');
            setEmail(''); // Clear the email field after successful submission
        } catch (error) {
            setError(error.message);
            console.log(error.code, error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md mb-4">
                            {success}
                        </div>
                    )}
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email-address" className="text-sm font-medium">
                                Email address
                            </label>
                            <Input
                                id="email-address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email address"
                                className="w-full"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Remember your password?{' '}
                        <NavLink to="/login" className="text-primary font-medium hover:underline">
                            Back to login
                        </NavLink>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ResetPassword;
