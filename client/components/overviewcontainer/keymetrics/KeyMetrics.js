import React from 'react'
import { useLocation } from 'react-router-dom'
import Subheader from '../../Subheader'
import GrowthMetric from './subpages/GrowthMetric'
import Metrics from './subpages/Metrics'
import PriceMetric from './subpages/PriceMetric'
import QualityMetric from './subpages/QualityMetric'
import SafetyMetric from './subpages/SafetyMetric'

export default function KeyMetrics() {
  const location = useLocation()
  const selected = location.pathname.split('/').pop().toLowerCase()

  return (
    <>
      <Subheader />
      {getCorrectPage(selected)}
    </>
  )
}

//* Function used to return/render the correct page
function getCorrectPage(selected) {
  switch (selected) {
    case 'price':
      return <PriceMetric />
    case 'growth':
      return <GrowthMetric />
    case 'quality':
      return <QualityMetric />
    case 'safety':
      return <SafetyMetric />
    default:
      return <Metrics />
  }
}
