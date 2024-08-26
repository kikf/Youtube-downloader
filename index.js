const fs = require('fs')
const logger = require('progress-estimator')()
const youtubedl = require('youtube-dl-exec')
const prompts = require('prompts');
const youtubesearchapi = require("youtube-search-api");



(async () => {
console.clear()
// Menu principal
  const menu = await prompts({
       type: 'select',
       name: 'menu-principal',
       message: 'Choose a option',
       choices: [
        {title:'Search a video and download'},
        {title:'Search videos and download on bulk'},
        {title:'Download video by id Coming soon', disabled: true},
        {title: 'Settings Coming soon', disabled: true}
       ]
  })
    // Selector the menu principal
    switch (menu["menu-principal"]) {
        
        // First case
        case 0:
        
        // Ask for a title
        let search = await prompts({
                type: 'text',
                name: 'search',
                message: 'Search your video',
                validate: value => value.length < 3 ? "The search query is too short, please enter a search query with at least" : true
            })

    
            // Search the video
            youtubesearchapi.GetListByKeyword(`<${search.search}>`)
            .then(async res => {
                let videoConfirmed = false;

                // Menu of the videos to select
                const selectorVideo = {
                    type: 'select',
                    name: 'selector',
                    message: 'Choose the videos',
                    choices: res.items.map(e => {
                        let wordsArray = e.title.split(',').map(word => word.trim());
                        let titleObject = {};
                        wordsArray.forEach((word, index) => {
                            titleObject[`word${index + 1}`] = word;
                        });
            
                        return {
                            id: e.id,
                            title: e.title,
                        };
                    }),
                    hint: '- Return to submit.'
                };    

                // If you dont want download that video, can you request another video
                while (!videoConfirmed) {
                    var selector = await prompts(selectorVideo);

                    const videoPrompt = await prompts({
                        type: 'toggle',
                        name: 'videoPrompt',
                        message: `Are you sure you want download this video?`,
                        initial: true,
                        active: 'yes',
                        inactive: 'no'
                    });
                    
                    if (videoPrompt.videoPrompt) {
                        videoConfirmed = true;
                        // Downloading the video 
                        const videoSeleccionado = selectorVideo.choices[selector.selector]
                        const { id, title } = videoSeleccionado;
                        const promise = youtubedl(`https://www.youtube.com/watch?v=${id}`, {
                            noWarnings: true,
                            path: 'videos/',
                            // quiet: true,
                            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
                        })
                        const result = await logger(promise, `Obtaining https://www.youtube.com/watch?v=${id}`)

                        console.log(result);       

                    }
                }
            });

            // Finish the first menu :D
            break;
        
        case 1:
                // Download videos on bulk
        let searchBulk = await prompts({
            type: 'text',
            name: 'search',
            message: 'Search your video',
            validate: value => value.length < 3 ? "The search query is too short, please enter a search query with at least" : true
        })


        // Search the video
        youtubesearchapi.GetListByKeyword(`<${searchBulk.search}>`)
        .then(async res => {
            let videoConfirmed = false;

            // Menu of the videos to select
            const selectorVideoBulk = {
                type: 'multiselect',
                name: 'selector',
                message: 'Choose the videos',
                validate: value => value > 2 ? "Select +2 videos for use this function" : false,
                choices: res.items.map(e => {
                    let wordsArray = e.title.split(',').map(word => word.trim());
                    let titleObject = {};
                    wordsArray.forEach((word, index) => {
                        titleObject[`word${index + 1}`] = word;
                    });
        
                    return {
                        id: e.id,
                        title: e.title,
                    };
                }),
                hint: '- Return to submit.'
            };    

            // If you dont want download that video, can you request another video
            while (!videoConfirmed) {
                var selectorBulk = await prompts(selectorVideoBulk);

                const videoPromptBulk = await prompts({
                    type: 'toggle',
                    name: 'videoPrompt',
                    message: `Are you sure you want download this videos?`,
                    initial: true,
                    active: 'yes',
                    inactive: 'no'
                });
                
                if (videoPromptBulk.videoPrompt) {
                    videoConfirmed = true;
                    // Downloading the video 
                    selectorBulk.selector.map(async e => {
                        const videoSeleccionados = selectorVideoBulk.choices[e];
                        const { id } = videoSeleccionados;

                        const promise = youtubedl(`https://www.youtube.com/watch?v=${id}`, {
                            noWarnings: true,
                            path: 'videos/',
                            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
                        })
                        const result = await logger(promise, `Obtaining https://www.youtube.com/watch?v=${id}`)
    
                        console.log(result);       
                        
                    })
                    
                }
            }
        });
                break;

        case 2:
        
        // Download a video by id

        
        


                break;
        case 3:


                break;
  }
})()