import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

import * as $ from 'jquery';

import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ResizableImageWebPart.module.scss';
import * as strings from 'ResizableImageWebPartStrings';

export interface IResizableImageWebPartProps {
  description: string;
  Image_Url: string;
  Image_Width: number;
  Image_Height: number;
  collectionData: any[];
}

export default class ResizableImageWebPart extends BaseClientSideWebPart<IResizableImageWebPartProps>
{

  public render(): void 
  {

    var Img_Area ="";
    
    try
    {
      if(this.properties.collectionData.length > 0)
      {
        this.properties.collectionData.forEach(element => {
            Img_Area += `<area href="`+ element.Link_Url +`" alt='`+ element.Link_Title +`' target="_blank" shape=poly coords="`+ element.Link_coords +`">`;
          });
      }
    }
    catch(ex)
    {
      this.domElement.innerHTML = `
      <div class="${ styles.resizableImage }">
        <h4><span>Web-Part properties are not configured well, please contact administrator to do it!</span></h4>
      </div>`;

      return;
    }

    this.domElement.innerHTML = `
      <div class="${ styles.resizableImage }">
        <map name="map_example">${Img_Area}</map>
        <img class="${styles.imgResize}" src="${escape(this.properties.Image_Url)}" alt="image map example" width=${escape(String(this.properties.Image_Width))} height=${escape(String(this.properties.Image_Height))} usemap="#map_example">
      </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                
                PropertyPaneTextField('Image_Url', {
                  label: strings.ImageURL,
                  onGetErrorMessage: this.validate_ImageURL.bind(this)                 
                }),
                PropertyPaneTextField('Image_Width', {
                  label: strings.ImageWidth,
                  onGetErrorMessage: this.validate_ImageWidth.bind(this)                 
                }),
                PropertyPaneTextField('Image_Height', {
                  label: strings.ImageHeight,
                  onGetErrorMessage: this.validate_ImageHeight.bind(this)                 
                }),
                PropertyFieldCollectionData("collectionData", {
                  key: "collectionData",
                  label: "",//Image Details
                  panelHeader: "Please provide Link urls and coords",
                  manageBtnLabel: "Click here for Image Link Details",
                  value: this.properties.collectionData,
                  fields: [
                    {
                      id: "Link_Title",
                      title: "Link Title",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "Link_Url",
                      title: "Link Url",
                      required: true,
                      type: CustomCollectionFieldType.string
                    },
                    {
                      id: "Link_coords",
                      title: "Link coords",
                      type: CustomCollectionFieldType.string,
                      required: true
                    }
                  ],
                  disabled: false
                })
                     
              ]
            }
          ]
        }
      ]
    };
  }

  private validate_ImageURL(value: string): string {
    if (value === null ||
      value.trim().length === 0) {
      return 'Provide a description';
    }
    
    return '';
  }

  private validate_ImageWidth(value: string): string {
    if (value === null ||
      value.trim().length === 0) {
      return 'Provide Image Width (Max: 800)';
    }

    if(Number(value))
    {
        //alert('Number');
    }
    else
    {
      return 'Provide Image Width in numbers (Max: 800)';
    }

    if(Number(value) > 800)
    {
      return 'Maximum Image Width is 800';
    }
 
    return '';
  }

  private validate_ImageHeight(value: string): string {
    if (value === null ||
      value.trim().length === 0) {
      return 'Provide Image Height';
    }

    if(Number(value))
    {
        //alert('Number');
    }
    else
    {
      return 'Provide Image Height in numbers';
    }

    return '';
  }
}