 if (localStorage.getItem('formSubmitted') === 'yes') {
            alert("Your appointment form has been submitted successfully!");
            localStorage.removeItem('formSubmitted');
        }