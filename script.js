document.addEventListener('DOMContentLoaded', () => {
  
  // Set current date on cover
  const dateElement = document.getElementById('currentDate');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = new Date().toLocaleDateString('pt-BR', options);

  // Mapping Input IDs to Output IDs
  const dataMapping = [
    { inputId: 'clientName', outputIds: ['outClientName', 'outClientNameSignature'] },
    { inputId: 'clientCompany', outputIds: ['outClientCompany', 'outClientCompany2', 'outClientCompanySignature'] },
    { inputId: 'clientContext', outputIds: ['outClientContext'] },
    { inputId: 'solutionDetails', outputIds: ['outSolutionDetails'] },
    { inputId: 'investmentValue', outputIds: ['outInvestmentValue'] }
  ];

  // Function to update output elements based on input value
  const updateOutputs = (inputElement, outputIds) => {
    const value = inputElement.value || '...';
    outputIds.forEach(outputId => {
      const outputElement = document.getElementById(outputId);
      if (outputElement) {
        // Use textContent or handle line breaks for textareas
        if (inputElement.tagName.toLowerCase() === 'textarea') {
          outputElement.innerHTML = value.replace(/\n/g, '<br>');
        } else {
          outputElement.textContent = value;
        }
      }
    });
  };

  // Add event listeners to all inputs
  dataMapping.forEach(mapping => {
    const inputElement = document.getElementById(mapping.inputId);
    if (inputElement) {
      // Initial update
      updateOutputs(inputElement, mapping.outputIds);

      // Listen for changes
      inputElement.addEventListener('input', () => {
        updateOutputs(inputElement, mapping.outputIds);
      });
    }
  });

  // Handle Services Selection
  const serviceCheckboxes = document.querySelectorAll('.service-cb');
  const investmentInput = document.getElementById('investmentValue');
  const outPricingFeatures = document.getElementById('outPricingFeatures');
  const outInvestmentValue = document.getElementById('outInvestmentValue');

  const updateServices = () => {
    let total = 0;
    const selectedServices = [];

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        total += parseFloat(cb.value);
        selectedServices.push(cb.getAttribute('data-name'));
      }
    });

    // Format total to BRL currency
    const formattedTotal = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const finalValueString = `${formattedTotal}/mês`;

    // Update Input
    investmentInput.value = finalValueString;
    // Update Output
    if (outInvestmentValue) {
      outInvestmentValue.textContent = finalValueString;
    }

    // Update Features List
    if (outPricingFeatures) {
      if (selectedServices.length > 0) {
        outPricingFeatures.innerHTML = selectedServices.map(service => `<li>✓ ${service}</li>`).join('');
      } else {
        outPricingFeatures.innerHTML = `<li>✓ Nenhum serviço selecionado</li>`;
      }
    }
  };

  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateServices);
  });

  // Export / Print Functionality
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }
});
