import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const customerType = data.get('customer_type');
    const name = data.get('name');
    const email = data.get('email');
    const phone = data.get('phone');
    const location = data.get('location');
    const message = data.get('message');

    // Determine recipient based on customer type
    const recipientEmail = customerType === 'returning' 
      ? 'design@gigifairviewdesign.com' 
      : 'hello@gigifairviewdesign.com';

    // TODO: Integrate with an email service (Resend, SendGrid, etc.)
    // For now, we'll use a free service like Web3Forms or return success
    
    // Web3Forms payload
    const web3formsPayload = {
      access_key: '915e230e-803e-4f9e-99ea-55dcd67edb3b',
      subject: `New ${customerType === 'returning' ? 'Established' : 'New'} Customer Inquiry`,
      from_name: name,
      email: email, // Sender's email (for reply-to)
      replyto: email, // Ensure replies go to customer
      to: recipientEmail, // Recipient: hello@ or design@
      message: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Location: ${location || 'N/A'}
Customer Type: ${customerType === 'returning' ? 'Established' : 'New'}

Message:
${message || 'N/A'}
      `.trim(),
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(web3formsPayload),
    });
    const result = await response.json();
    
    console.log('Web3Forms response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to send email');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Form submitted successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to submit form.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

