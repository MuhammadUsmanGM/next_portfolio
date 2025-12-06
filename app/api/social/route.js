


import { NextResponse } from 'next/server';



export async function GET() {

    console.log("Social API route hit");

    const socialLinks = {

        success: true,

        links: {

            email: 'mu.ai.dev@gmail.com',

            github: 'https://github.com/MuhammadUsmanGM',

            linkedin: 'https://www.linkedin.com/in/muhammad-usman-ai-dev',

            phone: '+92 325 6550687'

        }

    };

    console.log("Returning social links:", socialLinks);

    return NextResponse.json(socialLinks);

}
