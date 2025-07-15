import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);               
        try {
            await signOut(auth);
            navigate("/login");
            console.log("Signed out successfully");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="container mx-auto max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Welcome to Firebase Auth</CardTitle>
                        <Button 
                            onClick={handleLogout} 
                            variant="outline" 
                            disabled={loading}
                        >
                            {loading ? 'Signing out...' : 'Sign out'}
                        </Button>
                    </div>
                    <CardDescription>
                        You are currently signed in as: {currentUser?.email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Authentication Successful</h2>
                        <p className="text-muted-foreground">
                            This is a protected page that can only be accessed by authenticated users.
                            You've successfully implemented Firebase Authentication with React.
                        </p>
                        <div className="mt-4 p-4 bg-primary/10 rounded border border-primary/20">
                            <h3 className="font-medium mb-2">User Information:</h3>
                            <p><strong>Email:</strong> {currentUser?.email}</p>
                            <p><strong>User ID:</strong> {currentUser?.uid}</p>
                            <p><strong>Email Verified:</strong> {currentUser?.emailVerified ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;