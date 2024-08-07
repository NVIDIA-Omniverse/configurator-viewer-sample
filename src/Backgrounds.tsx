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

import React from "react";
import './Backgrounds.css';


export interface BackgroundOption {
    label: string;
    variant: string
}

interface BackgroundInfo {
    width: number;
    options: BackgroundOption[];
    selectedLabel?: string;
    onSelect: (option: BackgroundOption) => void;
}

interface BackgroundState {
    selectedIndex: number | null;
}

export default class Background extends React.Component<BackgroundInfo, BackgroundState> {
    constructor(props: BackgroundInfo) {
        super(props);
        // Initialize state with the index of the default background
        this.state = {
            selectedIndex: this._findIndex("Nvidia Green Studio")
        };
    }
    
    /**
    * @function _handleSelectChange
    *
    * Handle selection in list.
    */
    _handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = parseInt(event.target.value, 10);
        this.setState({ selectedIndex: selectedIndex });
        if (this.props.onSelect) {
            this.props.onSelect(this.props.options[selectedIndex]);
        }
    };
    
    /**
    * @function componentDidUpdate
    *
    * Update state if the selected label changes.
    */
    componentDidUpdate(prevProps: BackgroundInfo) {
        if (prevProps.selectedLabel !== this.props.selectedLabel) {
            const newIndex = this._findIndex(this.props.selectedLabel);
            if (newIndex !== this.state.selectedIndex) {
                this.setState({ selectedIndex: newIndex });
            }
        }
    }
    
    /**
    * @function _findIndex
    *
    * Find index of option by label.
    */
    private _findIndex (label?: string): number {
        return this.props.options.findIndex(asset => asset.label === label);
    }
    
    /**
    * @function _renderSelector
    *
    * Render the selector.
    */
    private _renderSelector (): JSX.Element {
          const options = this.props.options.map((asset, index) => (
              <option key={index} value={index} className="backgroundOption">
                  {asset.label}
              </option>
          ));

          return (
              <select
                  className="backgroundSelector"
                  onChange={this._handleSelectChange}
                  value={this.state.selectedIndex || ''}>
                  {options}
              </select>
          );
    }
    
    render() {
          return (
              <div className="backgroundContainer" style={{ width: this.props.width, height: "100vh" }}>
                  <div className="backgroundHeader">
                      {'Background'}
                  </div>
                  <div className="backgroundSelectorContainer">
                      {this._renderSelector()}
                  </div>
              </div>
          );
    }
}
