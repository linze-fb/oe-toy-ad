'use client';

import React, { useEffect } from 'react';
import { Ad } from '@/model/adModels';
import { Card, CardContent, Typography, Link, Box } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

interface AdDisplayProps {
  ad: Ad;
  triggeredKeywords: string[];
}

const CompactCard = styled(Card)({
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem',
  margin: '1rem 0',
  borderRadius: '6px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  border: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
});

const CompactImage = styled('img')({
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '4px',
  marginRight: '0.75rem',
});

const AdDisplay: React.FC<AdDisplayProps> = ({ ad, triggeredKeywords }) => {

  // Log impression when the ad is rendered
  useEffect(() => {
    const logImpression = async () => {
      try {
        await axios.post('/api/logImpression', {
          adId: ad.id,
          category: ad.category,
          company: ad.company,
          triggeredKeywords,
        });
      } catch (error) {
        console.error('Error logging impression:', error);
      }
    };
    logImpression();
  }, [ad, triggeredKeywords]);

  // Log click when the user clicks on the ad
  const handleClick = async () => {
    try {
      await axios.post('/api/logClick', {
        adId: ad.id,
        category: ad.category,
        company: ad.company,
      });
    } catch (error) {
      console.error('Error logging click:', error);
    }
  };

  return (
    <CompactCard role="banner" className="ad-container">
      {ad.imageUrl && <CompactImage src={ad.imageUrl} alt={ad.title} />}
      <CardContent style={{ padding: '0' }}>
        <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
          {ad.title}
        </Typography>
        <Typography variant="body2" style={{ fontSize: '0.875rem', color: '#555' }}>
          {ad.description}
        </Typography>
        <Box mt={0.5}>
          <Link
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            style={{ fontSize: '0.875rem', color: '#1a73e8' }}
            onClick={handleClick}
          >
            Learn More
          </Link>
        </Box>
      </CardContent>
    </CompactCard>
  );
};

export default AdDisplay;
