import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  color: white;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    width: 95%;
    max-height: 95vh;
  }
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #ccc;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 1rem;
  background-color: #2d2d2d;
  color: white;
  border: 1px solid #404040;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }

  @media (max-width: 768px) {
    padding: 6px;
    margin-bottom: 0.5rem;
    font-size: 14px;
  }
`;

const LayoutOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const LayoutOption = styled.div`
  border: 2px solid ${props => props.selected ? '#4CAF50' : '#404040'};
  border-radius: 4px;
  padding: 1rem;
  cursor: pointer;
  background-color: #2d2d2d;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4CAF50;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const LayoutPreview = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  height: 60px;
  margin-bottom: 0.5rem;
  gap: 4px;

  @media (max-width: 768px) {
    height: 40px;
    margin-bottom: 0.25rem;
  }
`;

const PanelPreview = styled.div`
  background-color: #404040;
  flex: ${props => props.flex || 1};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #ccc;
  ${props => props.nested && `
    display: flex;
    flex-direction: column;
    & > div {
      flex: 1;
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  gap: 10px;

  @media (max-width: 768px) {
    margin-top: 1rem;
    flex-direction: column;
    gap: 8px;
  }
`;

const Button = styled.button`
  background-color: ${props => props.secondary ? '#2d2d2d' : '#4CAF50'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: auto;
  min-width: 120px;
  
  &:hover {
    background-color: ${props => props.secondary ? '#404040' : '#45a049'};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`;

const Settings = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Settings</Title>
        
        <Section>
          <SectionTitle>Layout</SectionTitle>
          <LayoutOptions>
            <LayoutOption 
              selected={localSettings.layout === 'horizontal'} 
              onClick={() => setLocalSettings({...localSettings, layout: 'horizontal'})}
            >
              <LayoutPreview>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 2, gap: '4px' }}>
                  <PanelPreview>HTML</PanelPreview>
                  <PanelPreview>CSS</PanelPreview>
                  <PanelPreview>JS</PanelPreview>
                </div>
                <PanelPreview flex={1}>Output</PanelPreview>
              </LayoutPreview>
              Layout 1
            </LayoutOption>
            <LayoutOption 
              selected={localSettings.layout === 'grid'} 
              onClick={() => setLocalSettings({...localSettings, layout: 'grid'})}
            >
              <LayoutPreview direction="column">
                <div style={{ display: 'flex', flex: 2, gap: '4px' }}>
                  <PanelPreview>HTML</PanelPreview>
                  <PanelPreview>CSS</PanelPreview>
                  <PanelPreview>JS</PanelPreview>
                </div>
                <PanelPreview flex={1}>Output</PanelPreview>
              </LayoutPreview>
              Layout 2
            </LayoutOption>
          </LayoutOptions>

          <Select
            value={localSettings.panelOrder}
            onChange={e => setLocalSettings({...localSettings, panelOrder: e.target.value})}
          >
            <option value="html-css-js">HTML → CSS → JS</option>
            <option value="js-html-css">JS → HTML → CSS</option>
            <option value="css-js-html">CSS → JS → HTML</option>
          </Select>
        </Section>

        <Section>
          <SectionTitle>Editor Theme</SectionTitle>
          <Select
            value={localSettings.theme}
            onChange={e => setLocalSettings({...localSettings, theme: e.target.value})}
          >
            <option value="vs-dark">Dark (VS Code)</option>
            <option value="light">Light</option>
            <option value="hc-black">High Contrast</option>
          </Select>
        </Section>

        <Section>
          <SectionTitle>Font Size</SectionTitle>
          <Select
            value={localSettings.fontSize}
            onChange={e => setLocalSettings({...localSettings, fontSize: e.target.value})}
          >
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
          </Select>
        </Section>

        <Section>
          <SectionTitle>Font Weight</SectionTitle>
          <Select
            value={localSettings.fontWeight}
            onChange={e => setLocalSettings({...localSettings, fontWeight: e.target.value})}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </Select>
        </Section>

        <Section>
          <SectionTitle>Tab Size</SectionTitle>
          <Select
            value={localSettings.tabSize}
            onChange={e => setLocalSettings({...localSettings, tabSize: e.target.value})}
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="8">8 spaces</option>
          </Select>
        </Section>

        <Section>
          <SectionTitle>Auto Save</SectionTitle>
          <Select
            value={localSettings.autoSave}
            onChange={e => setLocalSettings({...localSettings, autoSave: e.target.value})}
          >
            <option value="off">Off</option>
            <option value="afterDelay">After Delay</option>
            <option value="onFocusChange">On Focus Change</option>
          </Select>
        </Section>

        <ButtonGroup>
          <Button onClick={handleSave}>Save Changes</Button>
          <Button secondary onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Settings; 