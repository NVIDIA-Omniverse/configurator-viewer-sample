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
import './Doors.css';


export interface DoorOption {
    label: string;
    variant: string
}

interface DoorInfo {
    width: number;
    options: DoorOption[];
    selectedLabel?: string;
    onSelect: (option: DoorOption) => void;
}

interface DoorState {
    selectedIndex: number | null;
}

export default class Door extends React.Component<DoorInfo, DoorState> {
    constructor(props: DoorInfo) {
        super(props);
        // Initialize state with the index of the default door state
        this.state = {
            selectedIndex: this._findIndex("Closed")
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
    componentDidUpdate(prevProps: DoorInfo) {
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
              <option key={index} value={index} className="doorsOption">
                  {asset.label}
              </option>
          ));

          return (
              <select
                  className="doorsSelector"
                  onChange={this._handleSelectChange}
                  value={this.state.selectedIndex || ''}>
                  {options}
              </select>
          );
    }
    
    render() {
          return (
              <div className="doorsContainer" style={{ width: this.props.width }}>
                  <div className="doorsHeader">
                      {'Doors'}
                  </div>
                  <div className="doorsSelectorContainer">
                      {this._renderSelector()}
                  </div>
              </div>
          );
    }
}
