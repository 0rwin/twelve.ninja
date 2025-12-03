import React from 'react'
import { BackgroundLayout } from '../components/layout/BackgroundLayout'
import WorldMap from '../components/WorldMap'

export default function MapPage() {
    return (
        <BackgroundLayout>
            <div className="w-full h-screen">
                <WorldMap />
            </div>
        </BackgroundLayout>
    )
}
