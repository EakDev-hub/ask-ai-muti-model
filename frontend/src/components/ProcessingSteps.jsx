import './ProcessingSteps.css';

function ProcessingSteps({ currentStep, processing }) {
  const steps = [
    { number: 1, name: 'Detection', description: 'Verify ID card' },
    { number: 2, name: 'Localization', description: 'Find fields' },
    { number: 3, name: 'OCR', description: 'Extract text' }
  ];

  const getStepStatus = (stepNumber) => {
    if (currentStep === 'complete') {
      return 'complete';
    }
    if (currentStep === stepNumber) {
      return processing ? 'active' : 'pending';
    }
    if (currentStep > stepNumber) {
      return 'complete';
    }
    return 'pending';
  };

  return (
    <div className="processing-steps">
      <div className="steps-container">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          
          return (
            <div key={step.number} className="step-wrapper">
              <div className={`step-item status-${status}`}>
                <div className="step-icon">
                  {status === 'complete' ? (
                    <span className="checkmark">✓</span>
                  ) : status === 'active' ? (
                    <span className="spinner"></span>
                  ) : (
                    <span className="step-num">{step.number}</span>
                  )}
                </div>
                <div className="step-content">
                  <div className="step-name">{step.name}</div>
                  <div className="step-description">{step.description}</div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`step-connector ${status === 'complete' ? 'complete' : ''}`}>
                  <div className="connector-line"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProcessingSteps;