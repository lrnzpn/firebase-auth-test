import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, analytics, logEvent } from '../firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Check password strength whenever password changes
    useEffect(() => {
        const strength = {
            score: 0,
            hasMinLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[^A-Za-z0-9]/.test(password),
        };
        
        // Calculate score based on criteria
        if (strength.hasMinLength) strength.score++;
        if (strength.hasUppercase) strength.score++;
        if (strength.hasLowercase) strength.score++;
        if (strength.hasNumber) strength.score++;
        if (strength.hasSpecialChar) strength.score++;
        
        setPasswordStrength(strength);
    }, [password]);
    
    const getStrengthLabel = () => {
        const { score } = passwordStrength;
        if (score === 0) return 'Very Weak';
        if (score === 1) return 'Weak';
        if (score === 2) return 'Fair';
        if (score === 3) return 'Good';
        if (score === 4) return 'Strong';
        if (score === 5) return 'Very Strong';
    };
    
    const getStrengthColor = () => {
        const { score } = passwordStrength;
        if (score <= 1) return 'bg-red-500';
        if (score === 2) return 'bg-orange-500';
        if (score === 3) return 'bg-yellow-500';
        if (score === 4) return 'bg-green-500';
        if (score === 5) return 'bg-emerald-500';
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate password strength
        if (passwordStrength.score < 3) {
            setError('Please create a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.');
            return;
        }
        
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Send email verification
            await sendEmailVerification(user);
            
            // Log sign_up event to Firebase Analytics
            logEvent(analytics, 'sign_up', {
                method: 'email',
                user_id: user.uid,
                password_strength_score: passwordStrength.score
            });
            
            // Show success message and navigate to login
            setError('');
            navigate('/login', { 
                state: { 
                    message: 'Account created successfully! Please check your email to verify your account.' 
                } 
            });
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
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={onSubmit} className="space-y-4">
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

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => password === '' && setPasswordFocused(false)}
                                required
                                placeholder="Password"
                                className="w-full"
                            />
                            
                            {passwordFocused && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium">Password Strength: {getStrengthLabel()}</span>
                                        <div className="w-2/3 bg-gray-200 rounded-full h-1.5">
                                            <div 
                                                className={`h-1.5 rounded-full ${getStrengthColor()}`} 
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <ul className="text-xs space-y-1 mt-2">
                                        <li className={passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ At least 8 characters
                                        </li>
                                        <li className={passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ At least one uppercase letter (A-Z)
                                        </li>
                                        <li className={passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ At least one lowercase letter (a-z)
                                        </li>
                                        <li className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ At least one number (0-9)
                                        </li>
                                        <li className={passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ At least one special character (!@#$%^&*)
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <NavLink to="/login" className="text-primary font-medium hover:underline">
                            Sign in
                        </NavLink>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;