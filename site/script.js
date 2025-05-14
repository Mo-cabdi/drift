function toggleAnswer(button) {
    const faqItem = button.closest('.faq-item'); // Current FAQ item
    const answer = faqItem.querySelector('.faq-answer'); // Current answer
    const isVisible = answer.classList.contains('visible'); // Check if the answer is already visible

    // Get all answers and buttons
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allButtons = document.querySelectorAll('.toggle-answer');

    // Close all answers and reset all buttons
    allAnswers.forEach((ans) => {
        ans.classList.remove('visible');
    });
    allButtons.forEach((btn) => {
        btn.classList.remove('open');
    });

    // Toggle visibility of the clicked question
    if (!isVisible) {
        answer.classList.add('visible');
        button.classList.add('open');
    }
}
