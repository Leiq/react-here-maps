// TODO add a way to load in the HERE maps stylesheet
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import cache from './utils/cache.ts';
import getScriptMap from './utils/get-script-map.ts';
import getPlatform from './utils/get-platform.ts';

// declare a standard callback type
type Callback = (error: any, result?: any) => void;

// declare an interface for a single script tag object
interface ScriptTag {
    tag: HTMLScriptElement;
    onLoad(callback: Callback): void;
}

// declare an interface for the script tags object
// that stores info on each requested script
interface ScriptTags {
    [name: string]: ScriptTag;
}

// declare an interface for objects that represent longitude
// and latitude coordinates
interface LatLngObject {
    lat: number;
    lng: number;
}

// declare an interface containing the required and potential
// props that can be passed to the HEREMap component
interface HEREMapProps {
    appId: string;
    appCode: string;
    center: LatLngObject;
    zoom: number;
}

// declare an interface containing the potential state flags
interface HEREMapState {
    loaded: boolean;
    map: any;
}

// export the HEREMap React Component from this module
export class HEREMap extends React.Component<HEREMapProps, HEREMapState> {
    scriptMap: ScriptTags = null;

    state: HEREMapState = {
        loaded: false,
        map: null,
    };

    componentDidMount() {
        this.scriptMap['uiScript'].onLoad((err, tag) => {
            const {
                appId,
                appCode,
                center,
                zoom,
            } = this.props;

            const platform = getPlatform(appId, appCode);

            const defaultLayers = platform.createDefaultLayers();

            const map = new H.Map(
                document.getElementById('mapContainer'),
                defaultLayers.normal.map,
                {
                    zoom,
                    center,
                }
            );

            // create the default UI for the map
            const ui = H.ui.UI.createDefault(map, defaultLayers);
        });
    }

    componentWillMount() {
        this.scriptMap = cache(getScriptMap());
    }

    render() {
        return (
            <div>
                <div ref="map" id="mapContainer" />
            </div>
        )
    }
}

// make the HEREMap component the default export
export default HEREMap;
