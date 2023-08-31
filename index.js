let aiData = [];
let isSeeMoreClicked = false;

const loadAiData = async (isSeeMore) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/ai/tools`);
    const data = await res.json();
    aiData = data.data.tools; 
    // console.log(aiData);
    displayAiData(aiData, isSeeMore);
}

// show all data
const displayAiData = (aiData, isSeeMore) => {
    // console.log(aiData);

    // 1. get the container element where you want to add the new elements
    const aiContainer = document.getElementById('ai-container');
    aiContainer.innerHTML = "";

    // display show all button if there are more than 6 ai
    const seeMoreContainer = document.getElementById('see-more-container')

    if (aiData.length > 6 && !isSeeMore) {
        // display only first 6 ai
        aiData = aiData.slice(0, 6);
        seeMoreContainer.classList.remove('hidden');
    }
    else {
        seeMoreContainer.classList.add('hidden');
    }

    aiData.forEach(ai => {
        // console.log(ai)

        // 2. create a div
        const aiCard = document.createElement('div');

        // 3. set inner html
        aiCard.innerHTML = `
        <div class="border rounded-lg p-5 h-full">
            <div class="mb-3">
                <img src="${ai.image}" alt="No image found" class="h-48 w-full rounded-lg">
            </div>
            <h2 class="text-base font-bold mb-2">Features</h2>
            <ol class="text-xs font-medium text-gray-400 mb-4">
                ${ai.features.map((feature, index) => `<li>${index + 1}. ${feature}</li>`).join('')}
            </ol>
            <hr class="mb-2">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-lg font-bold mb-2">${ai.name}</h1>
                    <div class="flex gap-2">
                        <img src="./images/date.png" alt="" class="w-4">
                        <p class="text-xs font-medium text-gray-500">${ai.published_in}</p>
                    </div>
                </div>
                <button onclick="handleShowDetails('${ai.id}')"><img src="./images/arrow.png" alt="" class="w-10 mt-2"></button>
            </div>
        </div>
        `;
        // 4. append child
        aiContainer.appendChild(aiCard);
    })
}

// show modal
const handleShowDetails = async (id) => {
    // console.log(id)
    // load single ai data
    const res = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`);
    const data = await res.json();
    const singleData = data.data;
    // console.log(singleData)
    showDetails(singleData);
}

const showDetails = (ai) => {
    const showDetailsContainer = document.getElementById('show-details-container');
    showDetailsContainer.innerHTML = `
    <div class="border border-[#EB5757]  bg-[#fdf3f3] p-4 rounded-lg">
       <h4 class="text-sm font-bold mb-6 text-justify">${ai.description}</h4>
       <div class="grid grid-cols-3 gap-2 text-xs font-bold text-center mb-2">
            ${ai.pricing?.map((item, index) => {
                const colors = ['#03A30A', '#F28927', '#EB5757'];
                const textColor = colors[index % colors.length];
                return `<p class="bg-white p-3 rounded-lg flex justify-center items-center" style="color: ${textColor}">${item.price} ${item.plan}</p>`
            }).join('') || ''}

            <div class="text-xs font-bold text-center mb-2 text-[#03A30A]">
                ${!ai.pricing ? `<p class="bg-white p-2 md:p-3 rounded-lg flex justify-center items-center md:h-[71px] lg:h-auto">Free of Cost/<br class="md:hidden"/>Basic</p>` : ''}
            </div>
            <div class="text-xs font-bold text-center mb-2 text-[#F28927]">
                ${!ai.pricing ? `<p class="bg-white p-2 md:p-3 rounded-lg flex justify-center items-center md:h-[71px] lg:h-auto">Free of Cost/<br class="md:hidden"/>Pro</p>` : ''}
            </div>
            <div class="text-xs font-bold text-center mb-2 text-[#EB5757]">
                ${!ai.pricing ? `<p class="bg-white p-2 md:p-3 rounded-lg flex justify-center items-center break-word">Free of Cost/<br class="lg:hidden"/>Enterprise
                </p>` : ''}
            </div>
       </div>

        <div class="flex justify-between gap-1">
            <div>
                <h2 class="text-base font-bold mb-2">Features</h2>
                <ul class="text-xs font-medium text-gray-400 mb-4 list-disc pl-3">
                ${Object.keys(ai.features).map(key => `<li>${ai.features[key].feature_name}</li>`).join('')}
                </ul>
            </div>
            <div>
                <h2 class="text-base font-bold mb-2">Integrations</h2>
                <ul class="text-xs font-medium text-gray-400 mb-4 list-disc">
                    ${ai.integrations?.map((integration) => `<li class="ml-3">${integration}</li>`).join('') || 'No data found'}
                </ul>
            </div>
        </div>
    </div>
    <div class="border p-4 text-center rounded-lg">
        <div class="relative">
            <img src="${ai.image_link[0]}" alt="No image found"  class="h-52 w-full rounded-lg mb-2">
            ${ai.accuracy.score !== null ? 
                `<h5 class="bg-[#EB5757] px-4 py-2 absolute top-2 right-2 text-sm font-semibold text-white rounded-lg w-28">${ai.accuracy.score * 100} accuracy</h5>` 
                : ''}
        </div>
        <h4 class="text-base font-bold mb-2">${ai.input_output_examples?.[0]?.input || ai.input_output_examples?.[1]?.input || "Can you give any example?"}</h4>
        <p class="text-xs font-medium text-gray-400 mb-4">${ai.input_output_examples?.[0]?.output || ai.input_output_examples?.[1]?.output || "No! Not Yet! Take a break!!!"}</p>
    </div>
    `;

    // show the modal
    show_details.showModal();
}
 
// handle see more button
const handleSeeMore = () => {
    loadAiData(true);
    isSeeMoreClicked = true;
}

// handle sort by date button
const handleSort = () => {
    
    aiData.sort((a, b) => {
      const dateA = new Date(a.published_in);
      const dateB = new Date(b.published_in);
      return dateA - dateB;
    });
  
    // Display the sorted data
    displayAiData(aiData, isSeeMoreClicked);
}
  
loadAiData();
