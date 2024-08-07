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
import './Wheels.css';


export interface WheelOption {
    label: string;
    variant: string
}

interface WheelInfo {
    width: number;
    options: WheelOption[];
    selectedLabel?: string;
    onSelect: (option: WheelOption) => void;
}

interface WheelState {
    selectedIndex: number | null;
}

export default class Wheel extends React.Component<WheelInfo, WheelState> {
    constructor(props: WheelInfo) {
        super(props);
        // Initialize state with the index of the default Wheel orientation
        this.state = {
            selectedIndex: this._findIndex("Straight")
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
    componentDidUpdate(prevProps: WheelInfo) {
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
    * Find index of the option by label.
    */
    private _findIndex(label?: string): number {
        return this.props.options.findIndex(option => option.label === label);
    }
    
    /**
    * @function _renderSelector
    *
    * Render the selector.
    */
    private _renderSelector (): JSX.Element {
          const options = this.props.options.map((asset, index) => (
              <option key={index} value={index} className="wheelsOption">
                  {asset.label}
              </option>
          ));

          return (
              <select
                  className="wheelsSelector"
                  onChange={this._handleSelectChange}
                  value={this.state.selectedIndex || ''}>
                  {options}
              </select>
          );
    }
    
    render() {
          return (
              <div className="wheelsContainer" style={{ width: this.props.width }}>
                  <div className="wheelsHeader">
                      {'Wheels'}
                  </div>
                  <div className="wheelsSelectorContainer">
                      {this._renderSelector()}
                  </div>
              </div>
          );
    }
}
