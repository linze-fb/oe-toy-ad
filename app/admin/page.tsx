'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Select, MenuItem, Button, Card, CardContent, styled, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Ad, AdPerformance, Company } from '@/model/adModels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const ReportContent = styled(Container)`
  padding: 20px;
`;

const AdminPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [adPerformanceData, setAdPerformanceData] = useState<AdPerformance[]>([]);
  const [keywordAnalysis, setKeywordAnalysis] = useState<any>({});
  const [totalImpressions, setTotalImpressions] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [uniqueImpressions, setUniqueImpressions] = useState<number>(0);
  const [uniqueClicks, setUniqueClicks] = useState<number>(0);
  const [CTR, setCTR] = useState<number>(0);

  useEffect(() => {
    const getAdsData = async () => {
      try {
        const { data } = await axios.get('/api/getAdData');
        setCompanies(data.companies);
        setAds(data.ads);
      } catch (error) {
        console.error('Error fetching ad data:', error);
      }
    };

    getAdsData();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const getPerformanceData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/getAdPerformance?company=${selectedCompany}`);
          const data = response.data;

          //Group data by ads with adId
          const aggregatedData = data.reduce((acc: any[], curr: any) => {
            const existing = acc.find((item) => item.adId === curr.adId);
            if (existing) {
              existing.impressions += curr.impressions;
              existing.clicks += curr.clicks;
            } else {
              acc.push({
                adId: curr.adId,
                category: curr.category,
                company: curr.company,
                impressions: curr.impressions,
                clicks: curr.clicks,
                triggeredKeywords: curr.triggeredKeywords
              });
            }
            return acc;
          }, []);

          const impressions = aggregatedData.reduce((sum: number, ap: AdPerformance) => sum + ap.impressions, 0);
          const clicks = aggregatedData.reduce((sum: number, ap: AdPerformance) => sum + ap.clicks, 0);

          //Click through rate
          const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

          //Unique ad interactions
          const uniqueImpressionsSet = new Set(aggregatedData.map((ap: AdPerformance) => ap.adId));
          const uniqueClicksSet = new Set(aggregatedData.filter((ap: AdPerformance) => ap.clicks > 0).map((ap: AdPerformance) => ap.adId));
          
          setUniqueImpressions(uniqueImpressionsSet.size);
          setUniqueClicks(uniqueClicksSet.size);

          const keywordCounts: { [key: string]: number } = {};
          data.forEach((ad: any) => {
            ad.triggeredKeywords.forEach((keyword: string) => {
              if (!keywordCounts[keyword]) {
                keywordCounts[keyword] = 0;
              }
              keywordCounts[keyword]++;
            });
          });

          setTotalImpressions(impressions);
          setTotalClicks(clicks);
          setCTR(ctr);
          setKeywordAnalysis(keywordCounts);
          setAdPerformanceData(aggregatedData);
        } catch (error) {
          console.error('Error fetching ad performance:', error);
        } finally {
          setLoading(false);
        }
      };

      getPerformanceData();
    }
  }, [selectedCompany]);

  const exportToPDF = () => {
    const input = document.getElementById('reportContent');
    if (!input) return;
  
    //Temporarily hide the export button
    const exportButton = document.querySelector('button');
    if (exportButton) {
      exportButton.style.display = 'none';
    }
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
  
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight);
        heightLeft -= pageHeight;
      }
  
      if (exportButton) {
        exportButton.style.display = 'block';
      }
  
      pdf.save('ad-performance-report.pdf');
    });
  };
  
  

  const generateChartData = () => {
    // Sort by Ad Title
    const sortedData = adPerformanceData.map((data: any) => {
      const ad = ads.find(ad => ad.id === data.adId);
      return { ...data, title: ad ? ad.title : 'Unknown' };
    }).sort((a: any, b: any) => a.title.localeCompare(b.title));

    const labels = sortedData.map((data: any) => data.title.length > 20 ? `${data.title.slice(0, 20)}...` : data.title);
    const impressions = sortedData.map((data: any) => data.impressions);
    const clicks = sortedData.map((data: any) => data.clicks);

    return {
      labels,
      datasets: [
        {
          label: 'Impressions',
          data: impressions,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Clicks',
          data: clicks,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <ReportContent maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Ad Performance Dashboard
      </Typography>

      <Box mb={4}>
        <Typography>Select a company to view their ad performance:</Typography>
        <Select
          value={selectedCompany || ''}
          onChange={(e) => setSelectedCompany(e.target.value as string)}
          fullWidth
        >
          {companies.map((company) => (
            <MenuItem key={company.name} value={company.name}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {adPerformanceData.length > 0 && (
        <Box id="reportContent">
          <Box display="flex" justifyContent="space-between" mb={4}>
            <Card sx={{ flex: 1, mr: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Performance Overview for {selectedCompany}</Typography>
                <Typography>Total Impressions: {totalImpressions}</Typography>
                <Typography>Total Clicks: {totalClicks}</Typography>
                <Typography>Click-Through Rate (CTR): {CTR.toFixed(2)}%</Typography>
                <Typography>Unique Ad Impressions: {uniqueImpressions}</Typography>
                <Typography>Unique Ad Clicks: {uniqueClicks}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, ml: 2 }}>
              <CardContent>
                <Typography variant="h6">Keyword Analysis</Typography>
                <ul>
                  {Object.entries(keywordAnalysis).map(([keyword, count]) => (
                    <li key={keyword}>
                      {keyword}: {count as number} triggers
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Box>

          <Box mt={4} sx={{ height: '500px' }}>
            <Bar data={generateChartData()} options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    title: (tooltipItems) => {
                      const index = tooltipItems[0].dataIndex;
                      const ap = adPerformanceData[index];
                      return `Ad ID: ${ap.adId}`;
                    },
                    label: (tooltipItem) => {
                      const index = tooltipItem.dataIndex;
                      const ap = adPerformanceData[index];
                      const matchedAd = ads.find(ad => ad.id === ap.adId);
                      return matchedAd ? `${tooltipItem.dataset.label}: ${tooltipItem.raw} (${matchedAd.title} - ${matchedAd.description})` : '';
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Ad Title'
                  },
                  ticks: {
                    callback: (value, index, values) => {
                      const ap = adPerformanceData[index];
                      const matchedAd = ads.find(ad => ad.id === ap.adId);
                      return matchedAd ? (matchedAd.title.length > 20 ? `${matchedAd.title.slice(0, 20)}...` : matchedAd.title) : '';
                    }
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Counts'
                  },
                  beginAtZero: true
                }
              }
            }} />
          </Box>

          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={exportToPDF}>
              Export Report as PDF
            </Button>
          </Box>
        </Box>
      )}

      {loading &&
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
        </Box>
      }
    
    </ReportContent>
  );
};

export default AdminPage;
