import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.NEXT_PUBLIC_SEND_GRID_API_KEY)

export async function sendEmail(msg) {
    try {
        await sgMail.send(msg)
    } catch (error) {
        console.error(error)

        if (error.response) {
            console.error(error.response.body)
        }

        throw new Error("Failed to send verification request")
    }
}