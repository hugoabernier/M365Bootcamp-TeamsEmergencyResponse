import * as React from 'react';
// import styles from './MapViewer.module.scss';
import { ReactBingmaps } from 'react-bingmaps';
import { IMapDataService } from '../services/MapDataService/IMapDataService';
import Pushpin from '../model/IPushpin';
import MessagePanel from './MessagePanel';
import styles from './MapViewer.module.scss';

export interface IMapViewerProps {
  mapDataService: IMapDataService;
  credentials: string;
  zoom: number;
  mapType: string;
}

export interface IMapViewerState {
  dataLoaded: boolean;
  points: Pushpin[];
}

export default class MapViewer extends React.Component<IMapViewerProps, IMapViewerState> {

  private container = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      points: [],
    };
  }

  public componentDidMount() {
    this.props.mapDataService.getMapPoints()
      .then((points: Pushpin[]) => {
        this.setState({
          dataLoaded: true,
          points: points
        });
      });
  }

  public render(): React.ReactElement<IMapViewerProps> {
    if (!this.props.credentials) {
      return (
        <div className={styles.mapViewer}>
          Please configure Bing Map key. You can obtain one free at the
          <a href="https://www.bingmapsportal.com/" target="_blank">Bing Maps Dev Center</a>
        </div>
      );
    } else if (this.props.zoom < 1 || this.props.zoom > 19) {
      return (
        <div className={styles.mapViewer}>
          Please configure a valid zoom level, normally between 1 (widest view) and 19 (closest view)
        </div>
      );
    } else if (!this.state.dataLoaded) {
      return (
        <div className={styles.mapViewer}
          ref={this.container}>Loading ...</div>
      );
    } else {
      return (
        <div className={styles.mapViewer}>
          <div className={styles.mapContainer}>
            <ReactBingmaps
              bingmapKey={this.props.credentials}
              center={this.getCenter(this.state.points)}
              zoom={this.props.zoom}
              mapTypeId={this.props.mapType}
              pushPins={this.state.points.map(
                p => ({
                  "location": [p.latitude, p.longitude],
                  "option": { color: 'red' }
                })
              )}
            />
          </div>
          <MessagePanel mapDataService={this.props.mapDataService} message="Hello world" />
        </div>
      );
    }
  }

  private getCenter(points: Pushpin[]): number[] {
    if (points.length === 0) {
      return [];
    } else {
      // Compute the centroid
      let sumX = 0;
      let sumY = 0;
      for (let p of points) {
        sumX += p.latitude;
        sumY += p.longitude;
      }
      return [sumX / points.length, sumY / points.length];
    }
  }


}

