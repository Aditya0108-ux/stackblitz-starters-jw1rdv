// Import necessary libraries
const express = require('express');
const axios = require('axios');

// Initialize the Express application
const app = express();

// Port for the server to listen on
const PORT = process.env.PORT || 3000;

// Route to fetch and download the PDF report
app.get('/fetch-pdf-report', async (req, res) => {
  // The access code from query params
  const { access_code } = req.query;

  if (!access_code) {
    return res.status(400).json({ error: 'Access code is required' });
  }

  // URL with the provided access_code
  const url = `https://doselect.com/reports/test?access_code=${access_code}&format=pdf`;

  // Headers for the API request
  const headers = {
    'DoSelect-Api-Key': '88d4266fd4e6338d13b845fcf28',
    'DoSelect-Api-Secret': '385041b7bbc2320471b8551d',
  };

  try {
    // Make the GET request to fetch the PDF
    const response = await axios.get(url, {
      headers: headers,
      responseType: 'stream', // Set response type to stream since the result is a PDF
      timeout: 10000,
    });

    // Set the appropriate headers to send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="candidate-report.pdf"'
    );

    // Pipe the PDF data to the response
    response.data.pipe(res);
    console.log(response);
  } catch (error) {
    console.error('Error fetching the report:', error);
    res.status(500).json({ error: 'Failed to fetch PDF report' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
