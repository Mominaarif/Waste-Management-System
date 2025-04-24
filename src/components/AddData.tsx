"use client"
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
declare global {
  interface Window {
    initMap?: () => void;
  }
}
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, User } from "firebase/auth";

// Define types for form data
interface Subcategory {
  checked: boolean;
  value: string;
}

interface WasteCategory {
  checked: boolean;
  subcategories: {
    [key: string]: Subcategory;
  };
}

interface FormData {
  ucName: string;
  population: string;
  households: string;
  incomeGroup: string;
  wasteCategories: {
    Residential: WasteCategory;
    Commercial: WasteCategory;
    Industrial: WasteCategory;
    Hazardous: WasteCategory;
  };
}

const paragraphStyle = {
  fontFamily: 'Open Sans',
  margin: 0,
  fontSize: 13,
};

const containerStyle = {
  width: "calc(100% + (350px))",
  height: "60vh",
  top: "0",
  left: "-180px",
  // border: "2px solid #73AD21",
  zIndex: 1,
  boxSizing: "border-box",
};

const formLabelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '5px 0 15px 0',
  display: 'inline-block',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const selectStyle = {
  width: '100%',
  padding: '8px',
  margin: '5px 0 15px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const checkboxStyle = {
  marginRight: '10px',
};

const submitButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px',
};

const AddData = ({ open }: any) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [roundedArea, setRoundedArea] = React.useState<number | undefined>();
  const [isPolygonDrawn, setIsPolygonDrawn] = React.useState<boolean>(false);
  const [selectedPolygon, setSelectedPolygon] = React.useState<google.maps.Polygon | null>(null);
  const [formData, setFormData] = useState<FormData>({
    ucName: '',
    population: '',
    households: '',
    incomeGroup: '',
    wasteCategories: {
      Residential: {
        checked: false,
        subcategories: {
          Paper: { checked: false, value: '' },
          Cardboard: { checked: false, value: '' },
          LightPlastic: { checked: false, value: '' },
          DensePlastic: { checked: false, value: '' },
          TextileWaste: { checked: false, value: '' },
          FoodWaste: { checked: false, value: '' },
          YardWaste: { checked: false, value: '' },
          Metals: { checked: false, value: '' },
          Glass: { checked: false, value: '' },
          Diapers: { checked: false, value: '' },
          AnimalDunk: { checked: false, value: '' },
          Wood: { checked: false, value: '' },
          Electronic: { checked: false, value: '' },
          Leather: { checked: false, value: '' },
          CDWaste: { checked: false, value: '' },
        }
      },
      Commercial: {
        checked: false,
        subcategories: {
          Paper: { checked: false, value: '' },
          Cardboard: { checked: false, value: '' },
          LightPlastic: { checked: false, value: '' },
          DensePlastic: { checked: false, value: '' },
          TextileWaste: { checked: false, value: '' },
          FoodWaste: { checked: false, value: '' },
          YardWaste: { checked: false, value: '' },
          Metals: { checked: false, value: '' },
          Glass: { checked: false, value: '' },
          Diapers: { checked: false, value: '' },
          AnimalDunk: { checked: false, value: '' },
          Wood: { checked: false, value: '' },
          Electronic: { checked: false, value: '' },
          Leather: { checked: false, value: '' },
          CDWaste: { checked: false, value: '' },
        }
      },
      Industrial: {
        checked: false,
        subcategories: {
          Paper: { checked: false, value: '' },
          Cardboard: { checked: false, value: '' },
          LightPlastic: { checked: false, value: '' },
          DensePlastic: { checked: false, value: '' },
          TextileWaste: { checked: false, value: '' },
          FoodWaste: { checked: false, value: '' },
          YardWaste: { checked: false, value: '' },
          Metals: { checked: false, value: '' },
          Glass: { checked: false, value: '' },
          Diapers: { checked: false, value: '' },
          AnimalDunk: { checked: false, value: '' },
          Wood: { checked: false, value: '' },
          Electronic: { checked: false, value: '' },
          Leather: { checked: false, value: '' },
          CDWaste: { checked: false, value: '' },
        }
      },
      Hazardous: {
        checked: false,
        subcategories: {
          Needles: { checked: false, value: '' },
          Syringes: { checked: false, value: '' },
          Scalpels: { checked: false, value: '' },
          InfusionSets: { checked: false, value: '' },
          SawsKnives: { checked: false, value: '' },
          Blades: { checked: false, value: '' },
          Chemicals: { checked: false, value: '' },
        }
      }
    },
  });

  useEffect(() => {
    const googleMapsScript = document.createElement('script');

    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA&libraries=drawing,geometry`;
    window.document.head.appendChild(googleMapsScript);

    googleMapsScript.addEventListener('load', () => {
      if (mapContainerRef.current) {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 31.5204, lng: 74.3587 },
          zoom: 12,
          mapTypeId: 'satellite' as google.maps.MapTypeId,
          // styles: Styles,
        });

        mapRef.current = map;

        const drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon' as google.maps.drawing.OverlayType],
          },
          polygonOptions: {
            editable: false,
            draggable: false,
          },
        });

        drawingManagerRef.current = drawingManager;
        drawingManager.setMap(map);

        window.google.maps.event.addListener(
          drawingManager,
          'overlaycomplete',
          (event: google.maps.drawing.OverlayCompleteEvent) => {
            if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
              const polygon = event.overlay as google.maps.Polygon;
              calculateArea(polygon);

              drawingManager.setOptions({
                drawingMode: null,
                drawingControl: false,
              });

              polygon.setOptions({
                editable: false,
                draggable: false,
              });

              setIsPolygonDrawn(true);

              window.google.maps.event.addListener(polygon, 'click', () => {
                setSelectedPolygon(polygon);
              });

              window.google.maps.event.addListener(polygon.getPath(), 'set_at', () => calculateArea(polygon));
              window.google.maps.event.addListener(polygon.getPath(), 'insert_at', () => calculateArea(polygon));
            }
          }
        );
      }
    });

    function calculateArea(polygon: google.maps.Polygon) {
      const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
      setRoundedArea(Math.round(area * 100) / 100);
    }

    // Cleanup function
    return () => {
      googleMapsScript.removeEventListener('load', () => { });
      window.document.head.removeChild(googleMapsScript);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category: keyof FormData['wasteCategories']) => {
    setFormData(prev => ({
      ...prev,
      wasteCategories: {
        ...prev.wasteCategories,
        [category]: {
          ...prev.wasteCategories[category],
          checked: !prev.wasteCategories[category].checked
        }
      }
    }));
  };

  const handleSubcategoryChange = (
    category: keyof FormData['wasteCategories'],
    subcategory: string,
    field: keyof Subcategory,
    value: boolean | string
  ) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (field === 'checked') {
        newData.wasteCategories[category].subcategories[subcategory].checked = value as boolean;
      } else {
        newData.wasteCategories[category].subcategories[subcategory].value = value as string;
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (!user) {
      alert('You must be logged in to submit data');
      return;
    }

    if (!isPolygonDrawn) {
      alert('Please draw a polygon on the map before submitting');
      return;
    }

    try {
      const polygonPath = selectedPolygon?.getPath().getArray().map(latLng => ({
        lat: latLng.lat(),
        lng: latLng.lng()
      }));

      const dataToSave = {
        ...formData,
        area: roundedArea,
        polygonPath,
        createdAt: new Date(),
        createdBy: user.uid
      };

      // Create a document with UC name as ID
      await setDoc(doc(db, "wasteData", formData.ucName), dataToSave);
      alert('Data saved successfully!');

      // Reset form and map
      setFormData({
        ucName: '',
        population: '',
        households: '',
        incomeGroup: '',
        wasteCategories: {
          Residential: {
            checked: false,
            subcategories: {
              Paper: { checked: false, value: '' },
              Cardboard: { checked: false, value: '' },
              LightPlastic: { checked: false, value: '' },
              DensePlastic: { checked: false, value: '' },
              TextileWaste: { checked: false, value: '' },
              FoodWaste: { checked: false, value: '' },
              YardWaste: { checked: false, value: '' },
              Metals: { checked: false, value: '' },
              Glass: { checked: false, value: '' },
              Diapers: { checked: false, value: '' },
              AnimalDunk: { checked: false, value: '' },
              Wood: { checked: false, value: '' },
              Electronic: { checked: false, value: '' },
              Leather: { checked: false, value: '' },
              CDWaste: { checked: false, value: '' },
            }
          },
          Commercial: {
            checked: false,
            subcategories: {
              Paper: { checked: false, value: '' },
              Cardboard: { checked: false, value: '' },
              LightPlastic: { checked: false, value: '' },
              DensePlastic: { checked: false, value: '' },
              TextileWaste: { checked: false, value: '' },
              FoodWaste: { checked: false, value: '' },
              YardWaste: { checked: false, value: '' },
              Metals: { checked: false, value: '' },
              Glass: { checked: false, value: '' },
              Diapers: { checked: false, value: '' },
              AnimalDunk: { checked: false, value: '' },
              Wood: { checked: false, value: '' },
              Electronic: { checked: false, value: '' },
              Leather: { checked: false, value: '' },
              CDWaste: { checked: false, value: '' },
            }
          },
          Industrial: {
            checked: false,
            subcategories: {
              Paper: { checked: false, value: '' },
              Cardboard: { checked: false, value: '' },
              LightPlastic: { checked: false, value: '' },
              DensePlastic: { checked: false, value: '' },
              TextileWaste: { checked: false, value: '' },
              FoodWaste: { checked: false, value: '' },
              YardWaste: { checked: false, value: '' },
              Metals: { checked: false, value: '' },
              Glass: { checked: false, value: '' },
              Diapers: { checked: false, value: '' },
              AnimalDunk: { checked: false, value: '' },
              Wood: { checked: false, value: '' },
              Electronic: { checked: false, value: '' },
              Leather: { checked: false, value: '' },
              CDWaste: { checked: false, value: '' },
            }
          },
          Hazardous: {
            checked: false,
            subcategories: {
              Needles: { checked: false, value: '' },
              Syringes: { checked: false, value: '' },
              Scalpels: { checked: false, value: '' },
              InfusionSets: { checked: false, value: '' },
              SawsKnives: { checked: false, value: '' },
              Blades: { checked: false, value: '' },
              Chemicals: { checked: false, value: '' },
            }
          }
        },
      });

      if (selectedPolygon) {
        selectedPolygon.setMap(null);
      }
      setRoundedArea(undefined);
      setIsPolygonDrawn(false);
      setSelectedPolygon(null);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  return (
    <div className='h-[calc(100vh-85px)] flex relative'>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ flex: 1, height: '100%' }} />

      {/* {roundedArea && (
        <p style={paragraphStyle}>
          <strong>Area:</strong> {roundedArea} square meters
        </p>
      )} */}

      <div
        className="calculation-box"
        style={{
          height: 100,
          width: 150,
          position: 'absolute',
          bottom: 40,
          left: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 15,
          textAlign: 'center',
        }}
      >
        <p style={paragraphStyle}>Click the map to draw a polygon.</p>
        <div id="calculated-area">
          {roundedArea && (
            <>
              <p style={paragraphStyle}>
                <strong>{roundedArea}</strong>
              </p>
              <p style={paragraphStyle}>square meters</p>
            </>
          )}
        </div>
      </div>


      {/* Form Container */}
      {selectedPolygon && (
        < div style={{ width: '350px', padding: '20px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ marginTop: 0 }}>Waste Management Data</h2>


          <form onSubmit={handleSubmit}>
            <label style={formLabelStyle}>UC Name:</label>
            <input
              type="text"
              name="ucName"
              value={formData.ucName}
              onChange={handleInputChange}
              style={{ ...inputStyle } as React.CSSProperties}
              required
            />

            <label style={formLabelStyle}>Population:</label>
            <input
              type="number"
              name="population"
              value={formData.population}
              onChange={handleInputChange}
              style={{ ...inputStyle } as React.CSSProperties}
              required
            />

            <label style={formLabelStyle}>Households:</label>
            <input
              type="number"
              name="households"
              value={formData.households}
              onChange={handleInputChange}
              style={{ ...inputStyle } as React.CSSProperties}
              required
            />

            <label style={formLabelStyle}>Income Group:</label>
            <select
              name="incomeGroup"
              value={formData.incomeGroup}
              onChange={handleInputChange}
              style={selectStyle}
              required
            >
              <option value="">Select Income Group</option>
              <option value="Low">Low</option>
              <option value="Middle">Middle</option>
              <option value="High">High</option>
            </select>

            <h3>Waste Categories</h3>

            {Object.entries(formData.wasteCategories).map(([category, categoryData]) => (
              <div key={category}>
                <label>
                  <input
                    type="checkbox"
                    checked={categoryData.checked}
                    onChange={() => handleCategoryChange(category as keyof FormData['wasteCategories'])}
                    style={checkboxStyle}
                  />
                  {category}
                </label>

                {categoryData.checked && (
                  <div style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    {Object.entries(categoryData.subcategories).map(([subcategory, subcategoryData]) => (
                      <div key={subcategory} style={{ marginBottom: '5px' }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={subcategoryData.checked}
                            onChange={() => handleSubcategoryChange(
                              category as keyof FormData['wasteCategories'],
                              subcategory,
                              'checked',
                              !subcategoryData.checked
                            )}
                            style={checkboxStyle}
                          />
                          {subcategory}
                        </label>

                        {subcategoryData.checked && (
                          <input
                            type="number"
                            placeholder="Amount (kg)"
                            value={subcategoryData.value}
                            onChange={(e) => handleSubcategoryChange(
                              category as keyof FormData['wasteCategories'],
                              subcategory,
                              'value',
                              e.target.value
                            )}
                            style={{ ...inputStyle, width: '80%', margin: '5px 0 5px 20px' } as React.CSSProperties}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button type="submit" style={submitButtonStyle}>
              Submit Data
            </button>
          </form>
        </div>
      )
      }
    </div >
  );
};

export default AddData;