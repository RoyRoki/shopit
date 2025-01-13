import React from 'react'

const ShareButton = () => {
      const shareUrl = () => {
            const url = window.location.href;
            console.log(url)
            if(navigator.share) {
                  navigator
                        .share({
                              title: 'Check this out!',
                              url: url,
                        });
            } else {
                  navigator.clipboard.writeText(url);
            }
      }
  return (
    <button className='text-2xl' onClick={shareUrl}>📡</button>
  )
}

export default ShareButton
