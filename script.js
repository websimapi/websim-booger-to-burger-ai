document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const resultsContainer = document.getElementById('results');
    const uploadedImage = document.getElementById('uploadedImage');
    
    const descriptionContainer = document.getElementById('description-container');
    const boogerDescription = document.getElementById('boogerDescription');
    const descLoader = document.getElementById('desc-loader');

    const promptContainer = document.getElementById('prompt-container');
    const burgerPrompt = document.getElementById('burgerPrompt');
    const promptLoader = document.getElementById('prompt-loader');

    const burgerContainer = document.getElementById('burger-container');
    const burgerImage = document.getElementById('burgerImage');
    const burgerLoader = document.getElementById('burger-loader');

    imageUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        resetUI();
        resultsContainer.style.display = 'flex';

        const imageDataUrl = await readFileAsDataURL(file);
        uploadedImage.src = imageDataUrl;

        // --- Step 1: Describe the "booger" ---
        showStep(descriptionContainer);
        const description = await getBoogerDescription(imageDataUrl);
        boogerDescription.textContent = description;
        hideLoader(descLoader);

        // --- Step 2: Create the burger prompt ---
        showStep(promptContainer);
        const newPrompt = await createBurgerPrompt(description);
        burgerPrompt.textContent = newPrompt;
        hideLoader(promptLoader);

        // --- Step 3: Generate the burger image ---
        showStep(burgerContainer);
        const imageUrl = await generateBurgerImage(newPrompt);
        burgerImage.src = imageUrl;
        hideLoader(burgerLoader);
    });

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function getBoogerDescription(imageDataUrl) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [{
                    role: 'user',
                    content: [{
                        type: 'text',
                        text: "Describe this image in extreme, vivid, and almost grotesque detail. Focus on textures (is it smooth, lumpy, stringy?), colors (be specific about hues and tones), shapes, and consistency. Be very descriptive and use evocative adjectives."
                    }, {
                        type: 'image_url',
                        image_url: { url: imageDataUrl },
                    }, ],
                }, ],
            });
            return completion.content;
        } catch (error) {
            console.error('Error getting description:', error);
            return 'Sorry, the AI chef is confused by this specimen.';
        }
    }

    async function createBurgerPrompt(description) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [{
                    role: 'system',
                    content: "You are a creative chef that turns abstract descriptions into detailed, appetizing prompts for an AI image generator to create a picture of a gourmet burger. Translate textures, colors, and shapes into food ingredients. Make it sound delicious and high-end."
                }, {
                    role: 'user',
                    content: `Take the following description and use it to create a detailed and appetizing prompt for generating a photorealistic image of a single, gourmet burger on a simple plate. Translate the characteristics from the description into burger ingredients and features. For example, a 'greenish hue' could become 'a dollop of avocado crema' or 'house-made relish'. 'Lumpy' could be 'a coarse-ground wagyu beef patty'. 'Stringy' could become 'strands of pulled pork' or 'melted raclette cheese'. Be creative and make the final prompt sound like a masterpiece. The prompt should be a single paragraph. Here is the description: "${description}"`
                }, ],
            });
            return completion.content;
        } catch (error) {
            console.error('Error creating prompt:', error);
            return 'Sorry, the AI chef dropped the recipe.';
        }
    }

    async function generateBurgerImage(prompt) {
        try {
            const result = await websim.imageGen({
                prompt: `${prompt}, food photography, studio lighting, delicious`,
                aspect_ratio: "1:1",
            });
            return result.url;
        } catch (error) {
            console.error('Error generating image:', error);
            burgerImage.alt = 'Image generation failed.';
            return '';
        }
    }

    function resetUI() {
        boogerDescription.textContent = '';
        burgerPrompt.textContent = '';
        burgerImage.src = '#';
        [descLoader, promptLoader, burgerLoader].forEach(loader => loader.style.display = 'block');
        [descriptionContainer, promptContainer, burgerContainer].forEach(container => container.style.display = 'none');
    }

    function showStep(container) {
        container.style.display = 'block';
    }

    function hideLoader(loader) {
        loader.style.display = 'none';
    }
});

