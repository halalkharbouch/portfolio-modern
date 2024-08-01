function shareOnFacebook(url) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  window.open(facebookUrl, "facebook-share-dialog", "width=800,height=600");
  return false;
}

function shareOnTwitter(url, text) {
  const twitterUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(text)}`;
  window.open(twitterUrl, "twitter-share-dialog", "width=800,height=600");
  return false;
}

function shareOnLinkedIn(url) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;
  window.open(linkedInUrl, "linkedin-share-dialog", "width=800,height=600");
  return false;
}

function shareOnPinterest(url, media) {
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    url
  )}&media=${encodeURIComponent(media)}`;
  window.open(pinterestUrl, "pinterest-share-dialog", "width=800,height=600");
  return false;
}
