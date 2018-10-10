const general = {
    missingParam: 'Missing params',
    errorOccurred: 'An error occurred. Please try again later',
    notFound: 'This data is not found in system. Please try again later',
    forbidden: 'You do not have permission to perform this. Please try again later',

    createSuccess: 'Created successfully',
    createError: 'Created unsuccessfully',

    saveSuccess: 'Saved successfully',
    saveError: 'Saved unsuccessfully',

    updateSuccess: 'Updated successfully',
    updateError: 'Updated unsuccessfully',

    removeSuccess: 'Removed successfully',
    removeError: 'Removed unsuccessfully',

    uploadSuccess: 'Uploaded successfully',
    uploadError: 'Uploaded unsuccessfully',

    replySuccess: 'Replied successfully',
    replyError: 'Replied unsuccessfully',

    commentSuccess: 'Commented successfully',
    commentError: 'Commented unsuccessfully',

    sendSuccess: 'Sent successfully',
    sendError: 'Sent unsuccessfully',
}

const messages = {
    general,
    captcha: {
        invalid: 'Captcha is invalid'
    },
    password: {
        required: 'Please enter your password',
        notMatch: 'The passwords do not match'
    },
    news: Object.assign({}, general, {
        // Add specific message for news here
        // If there're the changes, please override general message above
        // Example: override `saveSuccess` variable
        saveSuccess: 'Saved news successfully',
        createSuccess: 'Created news successfully',
    }),
    user: Object.assign({}, general, {
        // Add specific message for user here
    }),
    user_type: Object.assign({}, general, {
        // Add specific message for user_type here
    }),
    category: Object.assign({}, general, {
        // Add specific message for category here
    }),
    doctor: Object.assign({}, general, {
        // Add specific message for doctor here
    }),
    facility: Object.assign({}, general, {
        // Add specific message for facility here
    }),
    patient: Object.assign({}, general, {
        // Add specific message for patient here
    }),
    question: Object.assign({}, general, {
        // Add specific message for question here
    }),
    answer: Object.assign({}, general, {
        // Add specific message for answer here
    }),
    question_tag: Object.assign({}, general, {
        // Add specific message for question_tag here
    }),
    test: Object.assign({}, general, {
        // Add specific message for test here
    }),
    test_question: Object.assign({}, general, {
        // Add specific message for test_question here
    }),
    test_answer: Object.assign({}, general, {
        // Add specific message for test_answer here
    }),
    banner: Object.assign({}, general, {
        // Add specific message for banner here
    }),
    contact: Object.assign({}, general, {
        // Add specific message for contact here
        sendSuccess: 'Sent contact succesfully',
        sendError: 'Sent contact unsuccesfully'
    }),
    feedback: Object.assign({}, general, {
        // Add specific message for feedback here
    }),
    page: Object.assign({}, general, {
        // Add specific message for page here
    }),
    specialization: Object.assign({}, general, {
        // Add specific message for specialization here
    }),
    terminology: Object.assign({}, general, {
        // Add specific message for terminology here
    }),
}

module.exports = messages