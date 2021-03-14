// import axios from 'redaxios/dist/redaxios.module';

const instagramRegExp = new RegExp(
  /<script type="text\/javascript">window\._sharedData = (.*);<\/script>/
);

const fetchInstagramPhotos = async (accountUrl) => {
  const response = await fetch(accountUrl, {
    method: 'HEAD',
    mode: 'no-cors',
  });
  const json = JSON.parse(response.data.match(instagramRegExp)[1]);
  const edges = json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(
    0,
    21
  );
  const photos = edges.map(({node}) => {
    return {
      url: `https://www.instagram.com/p/${node.shortcode}/`,
      thumbnailUrl: node.thumbnail_src,
      displayUrl: node.display_url,
      caption: node.edge_media_to_caption.edges[0].node.text,
    };
  });
  return photos;
};

(async () => {
  try {
    const photos = await fetchInstagramPhotos(
      'https://www.instagram.com/psalidiamarousiou/'
    );
    const container = document.getElementById('instagram-photos');
    photos.forEach((el) => {
      const a = document.createElement('a');
      const img = document.createElement('img');

      a.setAttribute('href', el.url);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.classList.add('instagram-photo');

      img.setAttribute('src', el.thumbnailUrl);
      img.setAttribute('alt', el.caption);
      img.setAttribute('loading', 'lazy');

      a.appendChild(img);
      container.appendChild(a);
    });
  } catch (e) {
    console.error('Fetching Instagram photos failed', e);
  }
})();
