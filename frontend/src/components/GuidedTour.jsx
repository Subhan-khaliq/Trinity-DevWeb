import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';

const GuidedTour = ({ run, setRun }) => {
    const { user } = useAuth();

    const steps = [
        {
            target: 'body',
            content: (
                <div>
                    <h3>Welcome to Trinity Store! 🚀</h3>
                    <p>Let's take a quick tour of your new shopping experience.</p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '#tour-logo',
            content: 'This is your way back home. You can always click here to see the latest products.',
            placement: 'bottom',
        },
        {
            target: '#tour-products-catalog',
            content: 'Browse our extensive catalog! Use the filters and search to find exactly what you need.',
            placement: 'top',
        },
        {
            target: '#tour-cart',
            content: 'Keep track of your items here. You can review your cart anytime before checkout.',
            placement: 'bottom',
        },
        {
            target: '#tour-profile',
            content: 'Manage your personal details and view your order history from your profile.',
            placement: 'bottom',
        },
    ];

    // Add admin-specific steps
    if (user?.role === 'admin') {
        steps.push({
            target: '#tour-dashboard',
            content: 'As an admin, you have access to a powerful analytics dashboard to monitor sales and trends.',
            placement: 'bottom',
        });
        steps.push({
            target: '#tour-stats-grid',
            content: 'Get a real-time overview of your store\'s health with these KPI cards.',
            placement: 'top',
        });
    }

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('hasTakenTour', 'true');
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: 'var(--primary-color)',
                    textColor: 'var(--text-main)',
                    backgroundColor: 'var(--surface-color)',
                    arrowColor: 'var(--surface-color)',
                },
                buttonNext: {
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                },
                buttonBack: {
                    marginRight: '10px',
                    color: 'var(--text-muted)',
                },
                buttonSkip: {
                    color: 'var(--text-muted)',
                }
            }}
        />
    );
};

export default GuidedTour;
