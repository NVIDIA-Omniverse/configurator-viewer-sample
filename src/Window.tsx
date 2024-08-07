/*
 * SPDX-FileCopyrightText: Copyright (c) 2024 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
 * SPDX-License-Identifier: LicenseRef-NvidiaProprietary
 *
 * NVIDIA CORPORATION, its affiliates and licensors retain all intellectual
 * property and proprietary rights in and to this material, related
 * documentation and any modifications thereto. Any use, reproduction,
 * disclosure or distribution of this material and related documentation
 * without an express license agreement from NVIDIA CORPORATION or
 * its affiliates is strictly prohibited.
 */
import React from 'react';
import Background, {BackgroundOption} from "./Backgrounds.tsx";
import Package, { PackageOption } from './Packages.tsx';
import Doors, { DoorOption } from './Doors.tsx';
import Wheels, { WheelOption } from './Wheels.tsx';
import './Window.css';
import AppStream from './AppStream'; // Ensure .tsx extension if needed
import StreamConfig from '../stream.config.json';
import LogoImage from './assets/nvidia_logo.png';
import SplashScreen from './assets/splash_screen.png';


interface AppState {
    gfnUser: string | null;
    streamReady: boolean;
    isLoadingAsset: boolean;
}

interface AppStreamMessageType {
    event_type: string;
    payload: any;
}

export default class App extends React.Component<{}, AppState> {    
    constructor(props: {}) {
        super(props);
        this.state = {
            gfnUser: null,
            streamReady: false,
            isLoadingAsset: StreamConfig.source === "gfn" && StreamConfig.gfn.prewarmed === false,
        }
    }

    /**
    * @function _toggleLoadingState
    *
    * Toggle state of loading asset indicator.
    */
    private _toggleLoadingState(isLoading: boolean): void {
        this.setState({ isLoadingAsset: isLoading });
    }
    
    /**
    * @function _onStreamStarted
    *
    * Called when the app stream starts. Add functionality if needed.
    */
    private _onStreamStarted(): void {
        console.log("App stream started")
    }

    /**
     * @function _onSelectPackage
     *
     * Updates the car colors
     *
     * @param {PackageOption} option 
     */
    _onSelectPackage(option: PackageOption) {
        const message: AppStreamMessageType = {
            event_type: "setPackage",
            payload: {
                "carPaint": option.carPaint,
                "wheelColors": option.wheelColors,
                "lightStripColor": option.lightStripColor,
                "intLeather":  option.intLeather,
                "intLeatherDash": option.intLeatherDash,
                "intTrimColor": option.intTrimColor,
                "stitchColor": option.stitchColor,
                "screenColor": option.screenColor
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
        
    }
    
    /**
     * @function _onSelectBackground
    *
    * Updates the background
    *
    * @param {BackgroundOption} option 
    */
   _onSelectBackground(option: BackgroundOption) {
        const message: AppStreamMessageType = {
            event_type: "setBackGround",
            payload: {
                "background": option.variant
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    }
    
    /**
     * @function _onSetWheelOrientation
    *
    * Changes the wheel direction
    *
    * @param {WheelOption} option 
    */
    _onSetWheelOrientation(option: WheelOption) {
        const message: AppStreamMessageType = {
            event_type: "setWheelOrientation",
            payload: {
                "wheelTurns": option.variant
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    }
    
    /**
     * @function _onSetDoorsOpen
    *
    * Opens or closes the doors
    *
    * @param {DoorOption} option 
    */
    _onSetDoorsOpen(option: DoorOption) {
        const message: AppStreamMessageType = {
            event_type: "setDoorsOpen",
            payload: {
                "doors": option.variant
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
        }
    
    /**
    * @function _handleCustomEvent
    *
    * Handle message from stream.
    */
    private _handleCustomEvent (event: any): void {
        if (!event) {
            return;
        }
        // Streamed app notification of asset loaded.
        if (event.event_type === "openedStageResult") {
            if (event.payload.result === "success") {
                this._toggleLoadingState(false);
                console.log('Kit App communicates an asset was loaded: ' + event.payload);
            }
            else {
                console.error('Kit App communicates there was an error loading: ' + event.payload);
                this._toggleLoadingState(false);
            }
        }
       
        // other messages from app to kit
        else if (event.messageRecipient === "kit") {
            console.log(JSON.parse(event.data).event_type);
        }
    }

    /**
    * @function _handleAppStreamFocus
    *
    */
    private _handleAppStreamFocus (): void {
        console.log('User is interacting in streamed viewer');
    }

    /**
    * @function _handleAppStreamBlur
    *
    * Update state when AppStream is not in focus.
    */
    private _handleAppStreamBlur (): void {
        console.log('User is not interacting in streamed viewer');
    }

    render() {
        const sidebarWidth = 300;
        const headerHeight = 60;
        const streamConfig: any = {
            source: StreamConfig.source,
            gfn: StreamConfig.gfn,
            local: StreamConfig.local
        };

        return (
            <div
            style={{
                position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                    >
                {/* Header */}
                <div className="header-bar">
                    <img src={LogoImage} alt="Logo" className="header-logo" />
                    <span className="header-title">Omniverse Configurator Example</span>
                </div>
            
                {/* Show splash screen based on isLoadingAsset state */}
                {this.state.gfnUser && StreamConfig.source === "gfn" &&
                    <img src={SplashScreen} alt="Splash Screen" className="splash-screen" style={{
                        position: 'absolute',
                        left: 0,
                        height: "auto",
                        width: window.innerWidth - sidebarWidth,
                        visibility: this.state.isLoadingAsset ? 'visible' : 'hidden'
                    }} />
                }

                {/* Streamed app */}
                <AppStream
                streamConfig={streamConfig}
                onLoggedIn={(userId) => this.setState({ gfnUser: userId })}
                onStarted={() => this._onStreamStarted()}
                onFocus={() => this._handleAppStreamFocus()}
                onBlur={() => this._handleAppStreamBlur()}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: `${headerHeight}px`,
                    height: `calc(100% - ${headerHeight}px)`,
                    width: `calc(100% - ${sidebarWidth}px)`,
                    visibility: this.state.isLoadingAsset ? 'hidden' : 'visible'
                }}
                handleCustomEvent={(event) => this._handleCustomEvent(event)}
                />

                {this.state.gfnUser &&
                <>
                <Background
                    options={[
                        { label: 'Bay Bridge', variant: "Bay_Bridge" },
                        { label: 'Nvidia Dark Studio Ring', variant: "Nvidia_Dark_Studio_Ring" },
                        { label: 'Nvidia Gray Studio', variant: "Nvidia_Gray_Studio" },
                        { label: 'Nvidia Green Exterior', variant: "Nvidia_Green_Exterior" },
                        { label: 'Nvidia Green Studio', variant: "Nvidia_Green_Studio" },
                        { label: 'Pacific Highway', variant: "Pacific_Highway" }
                    ]
                    }
                    onSelect={(option) => this._onSelectBackground(option)}
                    width={sidebarWidth}
                />
                <Doors
                    width={sidebarWidth}
                    options={[
                        { label: 'Open', variant: "All_Open" },
                        { label: 'Closed', variant: "All_Closed" },
                        { label: "Driver's Door Open", variant: "FrontLeft_Open" }
                    ]
                    }
                    onSelect={(option) => this._onSetDoorsOpen(option)}
                />
                <Wheels
                    width={sidebarWidth}
                    options={[
                        { label: 'Straight', variant: "Straight" },
                        { label: 'Left', variant: "Left" },
                        { label: 'Right', variant: "Right" }
                    ]
                    }
                    onSelect={(option) => this._onSetWheelOrientation(option)}
                />
                <Package
                    width={sidebarWidth}
                    options={[
                        {
                            label: 'Blanco',
                            carPaint: 'Blanco',
                            intLeather: 'Cloud',
                            intLeatherDash: 'Cloud',
                            intTrimColor: 'Cloud',
                            lightStripColor: 'White',
                            screenColor: 'White',
                            stitchColor: 'Black',
                            wheelColors: 'WhiteGlow',
                        },
                        
                        {
                            label: 'Blue Silver',
                            carPaint: 'BlueSilver',
                            intLeather: 'Grey',
                            intLeatherDash: 'Grey',
                            intTrimColor: 'Black',
                            lightStripColor: 'blue',
                            screenColor: 'White',
                            stitchColor: 'Black',
                            wheelColors: 'Silver',
                        },
                        
                        {
                            label: 'Hornet',
                            carPaint: 'Hornet',
                            intLeather: 'Hornet',
                            intLeatherDash: 'Hornet',
                            intTrimColor: 'Hornet',
                            lightStripColor: 'Yellow',
                            screenColor: 'Hornet',
                            stitchColor: 'Hornet',
                            wheelColors: 'Black',
                        },
                        
                        {
                            label: 'Noir',
                            carPaint: 'Noir',
                            intLeather: 'Grey',
                            intLeatherDash: 'Grey',
                            intTrimColor: 'Cloud',
                            lightStripColor: 'White',
                            screenColor: 'White',
                            stitchColor: 'Black',
                            wheelColors: 'Silver',
                        },
                        
                        {
                            label: 'Nvidia Green Black',
                            carPaint: 'Nvidia_Green_Black',
                            intLeather: 'NvidiaGreen',
                            intLeatherDash: 'NvidiaGreen',
                            intTrimColor: 'NvidiaGreen',
                            lightStripColor: 'blue',
                            screenColor: 'Blue',
                            stitchColor: 'Grey',
                            wheelColors: 'NvidiaSet',
                        },
                        
                        {
                            label: 'Olive',
                            carPaint: 'Olive',
                            intLeather: 'Tan',
                            intLeatherDash: 'Tan',
                            intTrimColor: 'Black',
                            lightStripColor: 'blue',
                            screenColor: 'Blue',
                            stitchColor: 'Black',
                            wheelColors: 'Gold',
                        },
                    
                        {
                            label: 'Sakura',
                            carPaint: 'Sakura',
                            intLeather: 'Cloud',
                            intLeatherDash: 'Cloud',
                            intTrimColor: 'Cloud',
                            lightStripColor: 'Pink',
                            screenColor: 'Pink',
                            stitchColor: 'Grey',
                            wheelColors: 'SakuraGlow'
                        },
                        
                        {
                            label: 'Silver',
                            carPaint: 'Silver',
                            intLeather: 'Cloud',
                            intLeatherDash: 'Cloud',
                            intTrimColor: 'Grey',
                            lightStripColor: 'blue',
                            screenColor: 'Blue',
                            stitchColor: 'Grey',
                            wheelColors: 'Silver',
                        },
                        
                        {
                            label: 'Vampire',
                            carPaint: 'Vampire',
                            intLeather: 'Black',
                            intLeatherDash: 'Black',
                            intTrimColor: 'Grey',
                            lightStripColor: 'Red',
                            screenColor: 'Red',
                            stitchColor: 'Red',
                            wheelColors: 'Rojo',
                        },
                        
                        {
                            label: 'Vino',
                            carPaint: 'Vino',
                            intLeather: 'Tan',
                            intLeatherDash: 'Tan',
                            intTrimColor: 'Cream',
                            lightStripColor: 'blue',
                            screenColor: 'Blue',
                            stitchColor: 'Grey',
                            wheelColors: 'Gold',
                        }
                    ]
                    }
                    onSelect={(option) => this._onSelectPackage(option)}
                    />
                    </>
                }
            </div>
            );
        }
    }

