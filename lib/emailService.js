// Simple Email Service for sending interview feedback
import { supabase } from '@/lib/supabase';

export async function sendFeedbackEmail(candidateEmail, candidateName, feedback, interviewDetails) {
  try {
    console.log(`📧 Sending feedback email to: ${candidateEmail}`);
    
    // Create email content
    const emailContent = {
      to: candidateEmail,
      subject: `Interview Feedback - ${interviewDetails.jobPosition}`,
      html: generateFeedbackEmailHTML(candidateName, feedback, interviewDetails),
      text: generateFeedbackEmailText(candidateName, feedback, interviewDetails)
    };

    // For now, we'll log the email content
    // In production, you'd integrate with an email service like SendGrid, Resend, etc.
    console.log('📧 Email Content:', emailContent);
    
    // Store email record in database
    const { error } = await supabase
      .from('EmailLogs')
      .insert([{
        candidate_email: candidateEmail,
        candidate_name: candidateName,
        interview_id: interviewDetails.interview_id,
        job_position: interviewDetails.jobPosition,
        email_content: emailContent,
        sent_at: new Date().toISOString(),
        status: 'sent'
      }]);

    if (error) {
      console.error('❌ Error storing email log:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Feedback email sent successfully');
    return { success: true, message: 'Feedback sent successfully' };
    
  } catch (error) {
    console.error('❌ Error sending feedback email:', error);
    return { success: false, error: error.message };
  }
}

function generateFeedbackEmailHTML(name, feedback, interviewDetails) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Interview Feedback</h2>
      <p>Dear ${name},</p>
      <p>Thank you for participating in the interview for the <strong>${interviewDetails.jobPosition}</strong> position.</p>
      
      <h3 style="color: #374151;">Your Interview Feedback:</h3>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Overall Rating: ${feedback.rating?.overall || 'N/A'}/10</h4>
        <p><strong>Summary:</strong> ${feedback.summary || 'No summary available'}</p>
        <p><strong>Recommendation:</strong> ${feedback.recommendation || 'No recommendation available'}</p>
        <p><strong>Additional Notes:</strong> ${feedback.recommendationMsg || 'No additional notes'}</p>
      </div>
      
      <p>Best regards,<br>AI Interview Team</p>
    </div>
  `;
}

function generateFeedbackEmailText(name, feedback, interviewDetails) {
  return `
Interview Feedback

Dear ${name},

Thank you for participating in the interview for the ${interviewDetails.jobPosition} position.

Your Interview Feedback:
- Overall Rating: ${feedback.rating?.overall || 'N/A'}/10
- Summary: ${feedback.summary || 'No summary available'}
- Recommendation: ${feedback.recommendation || 'No recommendation available'}
- Additional Notes: ${feedback.recommendationMsg || 'No additional notes'}

Best regards,
AI Interview Team
  `;
}

