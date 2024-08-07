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
import './Packages.css';


export interface PackageOption {
    label: string,
    carPaint: string,
    intLeather: string,
    intLeatherDash: string,
    intTrimColor: string,
    lightStripColor: string,
    screenColor: string,
    stitchColor: string,
    wheelColors: string
}


interface PackageInfo {
    width: number;
    options: PackageOption[];
    selectedLabel?: string;
    onSelect: (option: PackageOption) => void;
}

interface PackageState {
    selectedIndex: number | null;
}

export default class Package extends React.Component<PackageInfo, PackageState> {
    constructor(props: PackageInfo) {
        super(props);
        // Initialize state with the index of the default Package
        this.state = {
            selectedIndex: this._findIndex("Nvidia Green Black")
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
    componentDidUpdate(prevProps: PackageInfo) {
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
        return this.props.options.findIndex(option => option.label === label);
    }
    
    /**
    * @function _renderSelector
    *
    * Render the selector.
    */
    private _renderSelector (): JSX.Element {
          const options = this.props.options.map((option, index) => (
              <option key={index} value={index} className="packagesOption">
                  {option.label}
              </option>
          ));

          return (
              <select
                  className="packagesSelector"
                  onChange={this._handleSelectChange}
                  value={this.state.selectedIndex || ''}>
                  {options}
              </select>
          );
    }
    
    render() {
          return (
              <div className="packagesContainer" style={{ width: this.props.width }}>
                  <div className="packagesHeader">
                      {'Packages'}
                  </div>
                  <div className="packagesSelectorContainer">
                      {this._renderSelector()}
                  </div>
              </div>
          );
    }
}
