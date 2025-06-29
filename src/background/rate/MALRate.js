export async function MediaDataMAL(animeId) {
  const url =
    `https://api.myanimelist.net/v2/anime/${animeId}?fields=id,title,main_picture,alternative_titles,start_date,end_date,mean,rank,created_at,updated_at,media_type,status,my_list_status,num_episodes,start_season,pictures`;
}
