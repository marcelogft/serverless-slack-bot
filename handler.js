'use strict';
const axios = require('axios'); 

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 
 
const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&page=${getRandom (1,10)}&release_date.gte=1980&release_date.lte=1989&with_genres=28`

module.exports.slack = async (event, context) => {
  try {
    const response = await axios(url);    
    const film = response.data.results[getRandom(0,19)]; 
    if (film) { 
    const formatDate = film.release_date.split('-');
    return {
      statusCode: 200,
      body: JSON.stringify({
        response_type: 'app',
        text: film.title + ` (${formatDate[2]}-${formatDate[1]}-${formatDate[0]})`,
        attachments: [
          {
            image_url: `https://image.tmdb.org/t/p/w500${film.poster_path}`, 
            color: "#2eb886",
            pretext: film.overview,  
            footer: "Serverless Action Flick",
            footer_icon: "https://user-images.githubusercontent.com/2752551/30405068-a7733b34-989e-11e7-8f66-7badaf1373ed.png" 
          }
        ] 
      }),
    };
  } else {
    return {
      statusCode: 200, 
      text: "No films!"
    }
  }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        response_type: 'app',
        text: "error",
        attachments: [
          {

          }
        ]

      })
  } 
  } 
};
