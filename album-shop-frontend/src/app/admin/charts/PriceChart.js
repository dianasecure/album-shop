'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAlbums } from '@/context/AlbumContext';

export default function PriceChart() {
    const { albums } = useAlbums();

    // Count albums per price
    const priceCounts = albums.reduce((acc, album) => {
        acc[album.price] = (acc[album.price] || 0) + 1;
        return acc;
    }, {});

    // Convert to chart-friendly format
    const data = Object.keys(priceCounts).map((price) => ({
        price,
        count: priceCounts[price]
    }));

    return (
        <div className="w-[50%] p-4 bg-fuchsia-100 rounded-lg">
            <h2 className="text-xl font-bold text-left text-gray-800 mb-4">Albums per price</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="price" stroke="#622137" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#C5AFA0" barSize={30} radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
