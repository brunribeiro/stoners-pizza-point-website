import React, { useEffect, useRef, useCallback } from 'react';

const SpreedlyForm = ({ htmlContent, onTokenReceived, onClose, submitButton }) => {
  const containerRef = useRef();

  // Create a ref to store the processed token IDs
  const processedTokenIdsRef = useRef(new Set());

  // Ref to track if a submission is in progress
  const isSubmittingRef = useRef(false);

  const customStyles = `
 <style id="custom-spreedly-style">

        * {
            box-sizing: border-box;
        }

        /* Safari-specific iframe fixes */
        iframe {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            min-height: 60px !important;
            border: none !important;
        }

       .spf-form {
  background: #fff;
  border-radius: 30px;

  min-width: 90%;
  width: 100%;
  margin:auto;
}


        .form-close {
            width: 100%;
            display: none;
            align-items: center;
            justify-content: flex-end;
            background-color: transparent;
            border: none;
            margin-top: 6px;
            margin-right: 11px;
        }

        @media screen and (max-width: 625px) {
            .spf-form {
                width: 80%;
            }
        }

        .spf-field-submit {
            border: none;
            margin: 0;
            padding: 1em;
            display: ${submitButton ? '' : 'none'};
        }

      .spf-field {
         display: inline-block;
         width: 100%;
         margin-bottom: 1em;  
         margin-left: 0;
      }

        .spf-field-card-cvv-row {
            display: flex !important;
            width: 100%;
            margin-bottom: 1em;
            gap: 10px;
            align-items: flex-start;
        }

        .spf-input-text {
            display: block;
            width: 100%;
            border-radius: 8px;
            border: 3px solid #ccc;
            padding: 0.8em 1em !important;
            font-size: 14px;
            margin-bottom: 0.5em;
        }

        .spf-fs-name .spf-field {
         width: 48%;
         margin-right: 3%;
         margin-left: 2%
         display: inline-grid;
      }


        .spf-fs-name .spf-field:last-child {
            margin-right: 0;
        }

        .spf-field-cc {
            margin-top: 0.25em;
            height: 40px;
        }

        .spf-month {
            width: 20%;
        }

        .spf-year {
            width: 20%;
        }

        .spf-card-number {
            flex: 1 1 70%;
            min-width: 0;
        }

        /* Expiration date iframe styling - match other fields */
        #month, [name="month"], [id*="month"],
        #year, [name="year"], [id*="year"] {
            display: block !important;
            visibility: visible !important;
            min-height: 45px !important;
            border-radius: 8px !important;
            border: 3px solid #ccc !important;
            padding: 0.8em 1em !important;
            font-size: 14px !important;
            box-sizing: border-box !important;
        }
 .input-outline-none{
    border-radius: 8px;
    border: 3px solid #ccc;
 }
        .spf-cvv {
            flex: 0 0 30%;
            max-width: 150px;
            min-width: 100px;
        }

        /* Explicit CVV field styling for Safari - match other iframes */
        /* Only style the iframe container, not the error div or other elements */
        #spreedly-cvv-test {
            display: block !important;
            visibility: visible !important;
            min-height: 45px !important;
            border-radius: 8px !important;
            border: 3px solid #ccc !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            margin-top: 0.25em;
        }

        /* Style the iframe itself */
        #spreedly-cvv-test iframe {
            border: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
        }

        /* Remove any internal borders from elements inside the CVV iframe */
        #spreedly-cvv-test iframe * {
            border: none !important;
            outline: none !important;
        }

        /* Ensure error div doesn't get unwanted styles */
        #cvv_error {
            border: none !important;
            padding: 0 !important;
            min-height: auto !important;
            margin-bottom: 0.5em;
        }

        .spf-button {
            display: inline-block;
            width: 100%;
            border-radius: 3px;
            background: #41637b !important;
            color: #fff;
            padding: 0.75em 2em;
            font-size: 100%;
            border: none;
            cursor: pointer;
        }

        .spf-button:hover {
            background: #537e9d !important;
        }

        .spf-button:active {
            position: relative;
            top: 1px;
        }

        .spf-errors {
            color: red;
            margin: 1em 0;
            line-height: 1.5;
        }

        .spf-alert {
            color: red;
            margin-bottom: 8px;
            display:none;
        }

        .spf-body {
            background: #ffffff;
            font-family: sans-serif;
            font-size: 100%;
            color: #000000;
            margin: 0;
            padding: 0;
        }

        .spf-section-title {
            font-weight: 600;
            font-size: 1.2em;
            color: #333;
            margin-top: 0;
            margin-bottom: 0.5em;
        }

        .spf-label {
            display: block;
            margin-bottom: 0.5em;
            white-space: nowrap;
            overflow: hidden;
            font-weight: 500;
            color: #555;
            font-size: 14px;
        }

        .spf-fieldset {
            border: none;
            margin: 0;
            border-bottom: none;
        }

        .spf-fieldset:last-child {
            border-bottom: none;
        }

        .spf-field-fname {
            width: 40%;
        }

        .spf-exp-divider {
            display: inline-block;
            font-size: 200%;
            position: relative;
            margin-left: 8px;
            margin-right: 8px;
        }

        .spf-field-postcode {
            width: 23%;
        }

        .spf-exp-row {
            display: flex;
        }

        /* Hide the duplicate input fields below MM/YYYY */
        .spf-exp-row input[type="text"] {
            display: none !important;
        }

        .spf-field-group {
            display: flex;
        }

        .spf-field-city {
            width: 48%;
            margin-right: 3.7%;
        }

        .spf-field-state {
            width: 23%;
            margin-right: 2%;
        }


        .spf-field-country {
            width: 100%;
        }
     
        /* Card number iframe container styling */
        #spreedly-number-test {
            display: block !important;
            visibility: visible !important;
            min-height: 45px !important;
            border-radius: 8px !important;
            border: 3px solid #ccc !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            margin-top: 0.25em;
        }

        /* Style the card number iframe itself */
        #spreedly-number-test iframe {
            border: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
        }

        /* Remove any internal borders from elements inside the iframe */
        #spreedly-number-test iframe * {
            border: none !important;
            outline: none !important;
        }

        /* Ensure error div doesn't get unwanted styles */
        #number_error {
            border: none !important;
            padding: 0 !important;
            min-height: auto !important;
            margin-bottom: 0.5em;
        }

        select {
            font: 400 12px/1.3 sans-serif;
            -webkit-appearance: none;
            appearance: none;
            color: #333;
            border: 1px solid #767676;
            line-height: 1;
            outline: 0;
            padding: 0.65em 2.5em 0.55em 0.75em;
            border-radius: 3px;
            background-color: #fff;
        }

        select:active {
            color: #41637b;
            border-color: #41637b;
            background-color: #fff;
        }

        .spf-input-text::placeholder {
            color: #999;
        }

        .payment-row {
            display: flex;
            gap: 2em;
        }

        .payment-row .spf-field {
            margin-bottom: 0;
        }

        .billing-row {
            display: flex;
            gap: 1.5em;
        }

        .billing-row .spf-field {
            margin-bottom: 0;
        }
           
        }
        @media screen and (max-width: 625px) {
            .spf-fs-name .spf-field {
                width: 100% !important;
            }
        }
    </style>
`;

  // Function to process token only once by tracking its ID
  const processTokenOnce = useCallback(
    (tokenData) => {
      // Extract a unique identifier from the token data
      const tokenId = tokenData?.token || JSON.stringify(tokenData);

      // Check if we've already processed this exact token
      if (processedTokenIdsRef.current.has(tokenId)) {
        console.log('ðŸ”„ Duplicate token detected, skipping processing');
        return;
      }

      // Add this token to our processed set
      processedTokenIdsRef.current.add(tokenId);
      console.log('âœ… Processing token:', tokenId);

      // Call the onTokenReceived callback
      if (onTokenReceived && typeof onTokenReceived === 'function') {
        onTokenReceived(tokenData);
      }

      // Clear the set after some time to allow future submissions
      setTimeout(() => {
        processedTokenIdsRef.current.delete(tokenId);
      }, 5000); // 5 seconds should be enough to catch duplicates
    },
    [onTokenReceived],
  );

  // Expose a ref to the form element for direct access
  useEffect(() => {
    // Detect Safari browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    let attempts = 0;
    const maxAttempts = isSafari ? 20 : 10; // More attempts for Safari

    // Wait for the iframe to load
    const checkForIframe = setInterval(() => {
      attempts++;
      const iframe = containerRef.current?.querySelector('iframe');

      if (iframe) {
        clearInterval(checkForIframe);
        console.log(`✅ Spreedly iframe found after ${attempts} attempts`);

        // Safari-specific: Force iframe visibility immediately
        if (isSafari) {
          iframe.style.display = 'block';
          iframe.style.visibility = 'visible';
          iframe.style.opacity = '1';
          iframe.style.minHeight = '60px';
          console.log('🍎 Applied Safari-specific iframe visibility fixes');
        }

        // Try to access the iframe content when it's loaded
        iframe.addEventListener('load', () => {
          try {
            // Store a reference to the form element
            window.spreedlyFormElement = iframe;
            console.log('✅ Spreedly iframe reference stored');

            // Safari-specific: Additional visibility check after load
            if (isSafari) {
              setTimeout(() => {
                // Double-check iframe is still visible
                iframe.style.display = 'block';
                iframe.style.visibility = 'visible';
                iframe.style.opacity = '1';
                console.log('🍎 Verified iframe visibility after load (Safari)');
              }, 500);
            }
          } catch (err) {
            console.error('❌ Could not access Spreedly iframe content:', err);
          }
        });
      }

      if (!iframe && attempts >= maxAttempts) {
        clearInterval(checkForIframe);
        console.error(`âŒ Spreedly iframe not found after ${maxAttempts} attempts`);
      }
    }, 500);

    return () => {
      clearInterval(checkForIframe);
      delete window.spreedlyFormElement;
    };
  }, []);

  const handleTokenReceived = useCallback(
    (data) => {
      processTokenOnce(data);
    },
    [processTokenOnce],
  );

  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    // Create a function to submit the Spreedly form
    window.submitSpreedlyPaymentForm = () => {
      // Prevent multiple submissions
      if (isSubmittingRef.current) {
        console.log('ðŸ”„ Submission already in progress, ignoring this request');
        return false;
      }

      console.log('ðŸ”˜ Attempting to validate and submit Spreedly form via custom button');

      // First validate the form
      const isValid = validateSpreedlyForm();
      if (!isValid) {
        console.log('ðŸ”„ Form validation failed, not submitting');
        return false;
      }

      // Set the submission lock
      isSubmittingRef.current = true;

      // Release the lock after a timeout (in case submission fails)
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 3000);

      // Try all available methods to submit the form
      return trySubmitSpreedlyForm();
    };

    // Helper function to validate the Spreedly form fields
    const validateSpreedlyForm = () => {
      try {
        // Try to find any form element
        const spreedlyForm = containerRef.current?.querySelector('form');
        if (spreedlyForm) {
          // Check if the form has HTML5 validation
          if (typeof spreedlyForm.checkValidity === 'function') {
            const isValid = spreedlyForm.checkValidity();
            if (!isValid) {
              // Trigger HTML5 validation UI
              const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
              spreedlyForm.dispatchEvent(submitEvent);
              return false;
            }
            return true;
          }
        }

        // Method 2: Try to validate using Spreedly iframe
        if (window.spreedlyFormElement) {
          try {
            const iframeForm = window.spreedlyFormElement.contentDocument?.querySelector('form');
            if (iframeForm && typeof iframeForm.checkValidity === 'function') {
              const isValid = iframeForm.checkValidity();
              if (!isValid) {
                // Trigger HTML5 validation UI
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                iframeForm.dispatchEvent(submitEvent);
                return false;
              }
              return true;
            }

            // Check for required input fields that are empty
            const requiredFields =
              window.spreedlyFormElement.contentDocument?.querySelectorAll('input[required]');
            if (requiredFields && requiredFields.length > 0) {
              for (let i = 0; i < requiredFields.length; i++) {
                const field = requiredFields[i];
                if (!field.value.trim()) {
                  field.focus();
                  field.classList.add('error');

                  // Create or update error message
                  let errorMsg = field.parentNode.querySelector('.error-message');
                  if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = 'red';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '4px';
                    field.parentNode.appendChild(errorMsg);
                  }
                  errorMsg.textContent = 'This field is required';

                  return false;
                }
              }
            }
          } catch (err) {
            console.error('âŒ Error validating iframe form:', err);
          }
        }

        // If we couldn't validate, assume it's valid
        return true;
      } catch (err) {
        console.error('âŒ Error validating Spreedly form:', err);
        return true; // Assume valid if we can't validate
      }
    };

    // Helper function that tries multiple methods to submit the form
    const trySubmitSpreedlyForm = () => {
      try {
        // Method 1: Try to dispatch a custom event that the Spreedly form might listen to
        const submitEvent = new CustomEvent('spreedly:submit');
        window.dispatchEvent(submitEvent);
        document.dispatchEvent(submitEvent);

        // Method 2: Try to find any form element and submit it
        const spreedlyForm = containerRef.current?.querySelector('form');
        if (spreedlyForm) {
          console.log('ðŸ”˜ Found Spreedly form, submitting directly');
          spreedlyForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          return true;
        }

        // Method 3: If there's a Spreedly object in the global scope, try to use its API
        if (window.Spreedly && typeof window.Spreedly.tokenizeCreditCard === 'function') {
          console.log('ðŸ”˜ Using Spreedly API directly');
          window.Spreedly.tokenizeCreditCard();
          return true;
        }

        // Method 4: Try to find and click a submit button in the container
        const submitButton = containerRef.current?.querySelector(
          'button[type="submit"], input[type="submit"]',
        );
        if (submitButton) {
          console.log('ðŸ”˜ Found submit button, clicking it');
          submitButton.click();
          return true;
        }

        // Method 5: Try to use the stored iframe reference
        if (window.spreedlyFormElement) {
          try {
            console.log('ðŸ”˜ Using stored iframe reference');
            // Try to find a submit button in the iframe
            const iframeSubmitButton =
              window.spreedlyFormElement.contentDocument?.querySelector('button[type="submit"]');
            if (iframeSubmitButton) {
              iframeSubmitButton.click();
              return true;
            }

            // If no button found, try to submit any form in the iframe
            const iframeForm = window.spreedlyFormElement.contentDocument?.querySelector('form');
            if (iframeForm) {
              iframeForm.submit();
              return true;
            }
          } catch (err) {
            console.error('âŒ Error accessing iframe content:', err);
          }
        }

        console.error('âŒ Could not find a way to submit the Spreedly form');
      } catch (err) {
        console.error('âŒ Error submitting Spreedly form:', err);
      }
      return false;
    };

    // Cleanup function for the submit handler
    return () => {
      delete window.submitSpreedlyPaymentForm;
      isSubmittingRef.current = false;
    };
  }, [containerRef]);

  useEffect(() => {
    if (!htmlContent || !containerRef.current) return;

    // Clean HTML and extract script
    const cleanedHTML = htmlContent
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove all <style> tags
      .replace(/(\r\n|\n|\r)/gm, ''); // Remove line breaks

    const scriptMatch = /<script id="spreedly-script">([\s\S]+?)<\/script>/gm.exec(cleanedHTML);
    const htmlWithoutScript = cleanedHTML.replace(
      /<script id="spreedly-script">([\s\S]+?)<\/script>/gm,
      '',
    );

    // Add a style tag to hide the default submit button
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-spreedly-hide-button', 'true');
    styleTag.textContent = `
      /* Hide the default Spreedly submit button */
      #spreedly-form button[type="submit"],
      #spreedly-iframe button[type="submit"],
      iframe[name^="spreedly"] button[type="submit"],
      .spreedly-iframe button[type="submit"],
      form[action*="spreedly"] button[type="submit"],
      button:contains("Save Card"),
      button.btn-block,
      .btn-primary,
      .btn-block,
      input[type="submit"].spf-button,
      .spf-field-submit input[type="submit"],
      fieldset.spf-field-submit input[type="submit"] {
      display: ${submitButton ? '' : 'none'};
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(styleTag);

    // Set up a MutationObserver to hide the button when it's dynamically added
    const observer = new MutationObserver((mutations) => {
      console.log('ðŸ” MutationObserver triggered', mutations);
      // Look for any buttons or submit inputs that might be the Save Card button
      // const buttons = document.querySelectorAll(
      //   'button, .btn, .btn-primary, .btn-block, input[type="submit"]',
      // );
      // buttons.forEach((button) => {
      //   if (button.value === 'Save Card' || button.textContent.includes('Save Card')) {
      //     console.log('ðŸ” Found and hiding Save Card button');
      //     button.style.display = 'none';
      //     button.style.visibility = 'hidden';
      //     button.style.opacity = '0';
      //     button.style.position = 'absolute';
      //     button.style.pointerEvents = 'none';
      //   }
      // });

      // Also check inside any iframes
      // const iframes = document.querySelectorAll('iframe');
      // iframes.forEach((iframe) => {
      //   try {
      //     const iframeButtons = iframe.contentDocument?.querySelectorAll(
      //       'button, .btn, .btn-primary, .btn-block, input[type="submit"]',
      //     );
      //     iframeButtons?.forEach((button) => {
      //       if (button.value === 'Save Card' || button.textContent.includes('Save Card')) {
      //         console.log('ðŸ” Found and hiding Save Card button inside iframe');
      //         button.style.display = 'none';
      //         button.style.visibility = 'hidden';
      //         button.style.opacity = '0';
      //         button.style.position = 'absolute';
      //         button.style.pointerEvents = 'none';
      //       }
      //     });
      //   } catch (e) {
      //     // Cross-origin restrictions may prevent access
      //   }
      // });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Store the observer in a ref for cleanup
    window.spreedlyButtonObserver = observer;

    // Set HTML content
    const htmlWithStyles = `
    ${customStyles}
    ${htmlWithoutScript}
  `;

    containerRef.current.innerHTML = htmlWithStyles;

    // Create the onTokenReceived object on window before script execution
    window.onTokenReceived = {
      postMessage: (data) => {
        if (data === 'Close') {
          handleClose();
        } else {
          try {
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            console.log('ðŸ’³ Spreedly token received via postMessage');
            handleTokenReceived(parsedData);
          } catch (err) {
            console.error('âŒ Error parsing token data:', err);
          }
        }
      },
    };

    // Add a direct DOM manipulation approach after a delay
    // setTimeout(() => {
    //   // Direct targeting of the specific element we found in the HTML
    //   const specificSubmitButton = document.querySelector('input[type="submit"].spf-button');
    //   if (specificSubmitButton) {
    //     console.log('ðŸ” Found and hiding Save Card button via specific selector');
    //     specificSubmitButton.style.display = 'none';
    //     specificSubmitButton.style.visibility = 'hidden';
    //     specificSubmitButton.style.opacity = '0';
    //     specificSubmitButton.style.position = 'absolute';
    //     specificSubmitButton.style.pointerEvents = 'none';
    //   }

    //   // Also try to find it in iframes
    //   const allIframes = document.querySelectorAll('iframe');
    //   allIframes.forEach((iframe) => {
    //     try {
    //       const specificIframeButton = iframe.contentDocument?.querySelector(
    //         'input[type="submit"].spf-button',
    //       );
    //       if (specificIframeButton) {
    //         console.log(
    //           'ðŸ” Found and hiding Save Card button inside iframe via specific selector',
    //         );
    //         specificIframeButton.style.display = 'none';
    //         specificIframeButton.style.visibility = 'hidden';
    //         specificIframeButton.style.opacity = '0';
    //         specificIframeButton.style.position = 'absolute';
    //         specificIframeButton.style.pointerEvents = 'none';
    //       }
    //     } catch (e) {
    //       // Cross-origin restrictions may prevent access
    //     }
    //   });

    //   // Try to find and hide the Save Card button directly
    //   const buttons = document.querySelectorAll('button, input[type="submit"]');
    //   buttons.forEach((button) => {
    //     if (button.value === 'Save Card' || button.textContent.includes('Save Card')) {
    //       console.log('ðŸ” Found and hiding Save Card button via direct DOM');
    //       button.style.display = 'none';
    //       button.style.visibility = 'hidden';
    //       button.style.opacity = '0';
    //       button.style.position = 'absolute';
    //       button.style.pointerEvents = 'none';
    //     }
    //   });

    //   // Also check inside any iframes again for buttons
    //   // Using the same iframes we already queried
    //   allIframes.forEach((iframe) => {
    //     try {
    //       const iframeButtons = iframe.contentDocument?.querySelectorAll(
    //         'button, input[type="submit"]',
    //       );
    //       iframeButtons?.forEach((button) => {
    //         if (button.value === 'Save Card' || button.textContent.includes('Save Card')) {
    //           console.log('ðŸ” Found and hiding Save Card button inside iframe via direct DOM');
    //           button.style.display = 'none';
    //           button.style.visibility = 'hidden';
    //           button.style.opacity = '0';
    //           button.style.position = 'absolute';
    //           button.style.pointerEvents = 'none';
    //         }
    //       });
    //     } catch (e) {
    //       // Cross-origin restrictions may prevent access
    //     }
    //   });
    // }, 1000); // Check after 1 second

    // Execute the Spreedly script if found
    if (scriptMatch && scriptMatch[1]) {
      const scriptContent = scriptMatch[1];

      setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            window.eval(scriptContent);
            console.log('âœ… Spreedly script executed');
          }
        } catch (err) {
          console.error('âŒ Spreedly eval error:', err);
        }
      }, 300); // Delay to give iframe time to load
    }

    // Handle postMessage events from the iframe
    const messageHandler = (e) => {
      if (e && e.data && typeof e.data === 'string' && e.data.includes('tokenRecieved')) {
        const dataArray = e.data.split('tokenRecieved--');
        const formData = JSON.parse(dataArray[1]);
        console.log('ðŸ’³ Spreedly token received via window event');
        handleTokenReceived(formData);
      }
    };

    window.addEventListener('message', messageHandler, false);

    // Cleanup function
    return () => {
      window.removeEventListener('message', messageHandler, false);
      delete window.onTokenReceived;
      // Clear the processed tokens set
      processedTokenIdsRef.current.clear();
      // Reset submission lock
      isSubmittingRef.current = false;
      // Remove the style tag we added
      const styleTag = document.querySelector('style[data-spreedly-hide-button]');
      if (styleTag) {
        styleTag.remove();
      }

      // Disconnect the MutationObserver
      if (window.spreedlyButtonObserver) {
        window.spreedlyButtonObserver.disconnect();
        delete window.spreedlyButtonObserver;
      }
    };
  }, [htmlContent, handleTokenReceived, handleClose]);

  return (
    <div style={{ minHeight: '400px', width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          minHeight: '350px',
          width: '100%',
          position: 'relative',
        }}
      />
      {/* Security Trust Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}
      >
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          style={{ flexShrink: 0 }}
        >
          <path
            d='M12 2L4 6V12C4 16.55 7.16 20.74 12 22C16.84 20.74 20 16.55 20 12V6L12 2Z'
            fill='#4CAF50'
          />
          <path d='M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z' fill='white' />
        </svg>
        <span
          style={{
            fontSize: '13px',
            color: '#555',
            fontWeight: '500',
            lineHeight: '1.4',
          }}
        >
          Your payment is encrypted and secured by{' '}
          <strong style={{ color: '#333' }}>Spreedly</strong>
        </span>
      </div>
    </div>
  );
};

// Default props
SpreedlyForm.defaultProps = {
  onTokenReceived: () => {},
  onClose: () => {},
};

export default SpreedlyForm;
