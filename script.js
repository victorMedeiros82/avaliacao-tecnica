window.jsPDF = window.jspdf.jsPDF;

document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('ratingValue');
    const ratingText = document.getElementById('ratingText');
    const form = document.getElementById('evaluationForm');
    const lowRatingOptions = document.getElementById('lowRatingOptions');
    const highRatingOptions = document.getElementById('highRatingOptions');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackPlaceholder = document.getElementById('feedback');

    const ratingTexts = {
        1: 'Péssimo',
        2: 'Ruim',
        3: 'Regular',
        4: 'Bom',
        5: 'Ótimo'
    };

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            ratingInput.value = rating;
            ratingText.textContent = ratingTexts[rating];

            // Reset all stars
            stars.forEach(s => s.classList.remove('active'));

            // Activate selected stars
            for (let i = 0; i < rating; i++) {
                stars[i].classList.add('active');
            }

            // Show appropriate options based on rating
            if (rating <= 3) {
                lowRatingOptions.classList.remove('d-none');
                highRatingOptions.classList.add('d-none');
                feedbackTitle.textContent = 'O QUE DEU ERRADO?';
                feedbackPlaceholder.placeholder = 'Descreva o que pode melhorar';
            } else {
                lowRatingOptions.classList.add('d-none');
                highRatingOptions.classList.remove('d-none');
                feedbackTitle.textContent = 'QUER DAR UM ELOGIO?';
                feedbackPlaceholder.placeholder = 'Escreva um elogio, será entregue ao técnico';
            }
        });
    });

    // Toggle aspect buttons
    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    // Form submission and PDF generation
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obter data e hora atual
        const now = new Date();
        const currentDate = now.toLocaleDateString('pt-BR');
        const currentTime = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Gerar PDF
        const doc = new jsPDF();
        const feedback = document.getElementById('feedback').value;
        const rating = ratingInput.value;
        const selectedAspects = Array.from(document.querySelectorAll('.btn-outline-secondary.active'))
            .map(btn => btn.textContent)
            .join(', ');

        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.text("Avaliação do Técnico", 20, 20);

        doc.setFontSize(12);
        doc.text(`Data da visita: ${currentDate}`, 20, 35);
        doc.text(`Avaliação: ${ratingTexts[rating]} (${rating} estrelas)`, 20, 45);
        doc.text(`Aspectos destacados: ${selectedAspects}`, 20, 55);
        doc.text(rating <= 3 ? 'Problemas relatados:' : 'Elogio:', 20, 70);

        const splitFeedback = doc.splitTextToSize(feedback, 170);
        doc.text(splitFeedback, 20, 80);

        doc.save('avaliacao-tecnico.pdf');

        // Mostrar página de sucesso
        document.getElementById('evaluationForm').style.display = 'none';
        const successPage = document.getElementById('successPage');
        successPage.style.display = 'block';

        // Atualizar data e hora na página de sucesso
        document.getElementById('currentDate').textContent = currentDate;
        document.getElementById('currentTime').textContent = currentTime;

        // Inicializar ícones do Lucide
        lucide.createIcons();
    });
});