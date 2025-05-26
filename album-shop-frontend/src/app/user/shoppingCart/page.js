'use client';
import React from 'react';
import { useShoppingList } from '../../../context/ShoppingListContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ShoppingCartPage() {
    const { shoppingList, removeFromShoppingList, updateQuantity } = useShoppingList();

    // Function to handle quantity change
    const handleQuantityChange = (albumId, quantity) => {
        if (quantity < 1) return; // Prevent negative quantities
        updateQuantity(albumId, quantity);
    };

    // Function to handle remove button click
    const handleRemove = (albumId) => {
        removeFromShoppingList(albumId);
    };

    return (
        <div className="flex justify-between min-h-screen">
            <div className="bg-[#3B252C] w-[20%] p-3">
                <div className="font-sans p-2 text-5xl text-center text-stone-50">recorDS</div>
                <div className="pt-2 text-xl text-center text-stone-50 pb-6">User page</div>
                <div className="flex flex-col gap-1 text">
                    <Link href="/user">
                        <button className="bg-stone-50 hover:bg-stone-200 text-[#634137] font-bold py-2 px-4 rounded-[10] w-full text-left">Main Page</button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col min-h-screen bg-fuchsia-100 w-[80%] ">
                <h1 className="text-center font-bold text-stone-950 text-xl mt-5">Shopping Cart</h1>

                {/* Album display */}
                <div className="flex flex-wrap gap-2 justify-center items-center p-4 mt-12">
                    
                    {shoppingList.length === 0 ? (
                        <p className="text-center text-stone-950">Your shopping cart is empty.</p>
                    ) : (
                        shoppingList.map((album) => (
                            <div key={album.id} className="p-4 bg-fuchsia-100 rounded-md w-48 h-100 flex flex-col">
                                {album.image.length > 0 && (
                                    <Image
                                        src={album.image[0].url}
                                        alt={album.title}
                                        width={100}
                                        height={100}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                )}
                                <h2 className="font-sans text-stone-950 font-semibold pt-2">{album.title}</h2> 
                                <p className="text-sm text-stone-950">{album.artist} - {album.year}</p>
                                <p className="text-sm text-red-900">{album.genre}</p>
                                <p className={`text-gray-950`}>{album.price} $</p>
                                
                                {/* Quantity input */}
                                <input
                                    type="number"
                                    value={album.quantity || 1}
                                    onChange={(e) => handleQuantityChange(album.id, parseInt(e.target.value))}
                                    min="1"
                                    className="mt-2 p-1 border border-gray-300 rounded text-gray-900"
                                />
                                
                                {/* Remove button */}
                                <button onClick={() => handleRemove(album.id)} className="mt-2 bg-red-500 text-white py-1 px-2 rounded">Remove</button>
                            </div>
                        ))

                    )}

                </div>
    
            </div>
        </div>
    );
}
