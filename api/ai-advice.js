export default async function handler(req, res) {

    // ==========================================
    // ONLY ALLOW POST REQUESTS
    // ==========================================

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    try {

        // ==========================================
        // GET PROMPT
        // ==========================================

        const { prompt } = req.body || {};


        if (!prompt) {

            return res.status(400).json({
                error: "Prompt is required"
            });

        }


        // ==========================================
        // CHECK API KEY
        // ==========================================

        if (!process.env.OPENAI_API_KEY) {

            console.error(
                "OPENAI_API_KEY is missing"
            );

            return res.status(500).json({
                error: "OpenAI API key is not configured."
            });

        }


        // ==========================================
        // CALL OPENAI
        // ==========================================

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`

                },

                body: JSON.stringify({

                    model: "gpt-5-mini",

                    input: prompt

                })

            }
        );


        // ==========================================
        // READ RESPONSE
        // ==========================================

        const data =
            await response.json();


        console.log(
            "OpenAI Status:",
            response.status
        );


        console.log(
            "OpenAI Response:",
            JSON.stringify(data)
        );


        // ==========================================
        // HANDLE OPENAI ERROR
        // ==========================================

        if (!response.ok) {

            return res.status(
                response.status
            ).json({

                error:
                    data?.error?.message ||
                    "OpenAI request failed."

            });

        }


        // ==========================================
        // EXTRACT AI TEXT
        // ==========================================

        let result =
            data?.output_text;


        // Fallback extraction if output_text
        // isn't available.

        if (!result && Array.isArray(data?.output)) {

            for (
                const item of data.output
            ) {

                if (
                    item?.type === "message" &&
                    Array.isArray(item.content)
                ) {

                    for (
                        const content
                        of item.content
                    ) {

                        if (
                            content?.type ===
                            "output_text"
                        ) {

                            result =
                                content.text;

                            break;

                        }

                    }

                }


                if (result) {
                    break;
                }

            }

        }


        // ==========================================
        // MAKE SURE WE ACTUALLY GOT TEXT
        // ==========================================

        if (!result) {

            console.error(
                "No text found in OpenAI response:",
                JSON.stringify(data)
            );

            return res.status(500).json({

                error:
                    "OpenAI returned a response, but no text was found."

            });

        }


        // ==========================================
        // SEND RESULT TO DASHBOARD
        // ==========================================

        return res.status(200).json({

            result: result

        });

    }


    catch (error) {

        console.error(
            "Server error:",
            error
        );


        return res.status(500).json({

            error:
                "Something went wrong while generating the AI response."

        });

    }

}
