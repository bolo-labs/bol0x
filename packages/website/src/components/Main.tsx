import * as React from 'react';
import BenefitsSection from './Sections/BenefitsSection';
import FooterSection from './Sections/FooterSection';
import GettingStartedSection from './Sections/GettingStartedSection';
import IntroductionSection from './Sections/IntroductionSection';
import SignupSection from './Sections/SignupSection';

export default class Main extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <SignupSection />
                <IntroductionSection />
                <BenefitsSection />
                <GettingStartedSection />
                <FooterSection />
            </div>
        );
    }
}
