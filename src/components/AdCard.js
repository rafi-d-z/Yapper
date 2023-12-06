import React from 'react';

function AdCard({ ad }) {
  return (
    <div className="mb-4">
      <p className="font-bold">Ad</p>
      <p>Headline: {ad.headline}</p>
      <p>Text: {ad.adText}</p>
    </div>
  );
}

export default AdCard;