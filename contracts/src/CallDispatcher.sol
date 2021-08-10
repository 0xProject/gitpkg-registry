// SPDX-License-Identifier: Apache-2.0
/*

  Copyright 2021 ZeroEx Intl.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

pragma solidity ^0.6;
pragma experimental ABIEncoderV2;


contract CallDispatcher {

    struct CallInfo {
        address payable to;
        uint256 gas;
        uint256 value;
        bytes data;
    }

    struct DispatchedCallResult {
        bytes resultData;
        bool success;
    }

    function dispatch()
        external
        payable
        returns (DispatchedCallResult[] memory callResults, uint256 currentBlock)
    {
        callResults = new DispatchedCallResult[](_getCallInfosLength());
        uint256 callDataPos = 36;
        CallInfo memory callInfo;
        for (uint256 i = 0; i < callResults.length; ++i) {
            (callInfo, callDataPos) = _readNextCallInfo(callDataPos);
            uint256 callGas = callInfo.gas == 0 ? gasleft() : callInfo.gas;
            (callResults[i].success, callResults[i].resultData) =
                callInfo.to.call{ value: callInfo.value, gas: callGas }(callInfo.data);
        }
        currentBlock = block.number;
    }

    function _getCallInfosLength() private pure returns (uint256 n) {
        assembly {
            n := calldataload(4)
        }
    }

    function _readNextCallInfo(uint256 callDataPos)
        private
        pure
        returns (CallInfo memory callInfo, uint256 newCallDataPos)
    {
        bytes memory encodedData;
        assembly {
            let size := calldataload(callDataPos)
            encodedData := mload(0x40)
            mstore(0x40, add(encodedData, add(size, 32)))
            mstore(encodedData, size)
            calldatacopy(add(encodedData, 32), add(callDataPos, 32), size)
        }
        callInfo = abi.decode(encodedData, (CallInfo));
        newCallDataPos = callDataPos + 32 + encodedData.length;
    }
}
