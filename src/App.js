import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Editor from '@monaco-editor/react';
import SplitPane from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import Settings from './components/Settings';
import Login from './components/Login';
import SignUp from './components/SignUp';
import * as monaco from 'monaco-editor';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Toolbar = styled.div`
  background-color: #1e1e1e;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--toolbar-height);

  @media (max-width: 768px) {
    padding: 8px;
    flex-direction: column;
    height: auto;
    gap: 8px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    height: 40px;
    width: auto;
  }

  h3 {
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    img {
      height: 32px;
    }

    h3 {
      font-size: 20px;
      
      span {
        display: none;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 8px;
    font-size: 14px;
  }
`;

const EditorContainer = styled.div`
  flex: 1;
  overflow: hidden;
  background-color: #1e1e1e;
  padding: 8px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--toolbar-height));

  @media (max-width: 768px) {
    padding: 4px;
    height: calc(100vh - var(--toolbar-height) - 56px);
  }
`;

const PreviewContainer = styled.div`
  background: white;
  width: 100%;
  height: 100%;
  border: 1px solid #333;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const EditorsGrid = styled.div`
  display: flex;
  flex: 2;
  background-color: #1e1e1e;
  height: 100%;
  min-height: 0;
`;

const PreviewSection = styled.div`
  flex: 1;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
`;

const PreviewContent = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
`;

const ConsoleOutput = styled.div`
  flex: 1;
  background-color: #1e1e1e;
  color: #fff;
  font-family: 'Consolas', monospace;
  padding: 8px;
  overflow-y: auto;
  border-left: 1px solid #333;

  .console-line {
    margin: 4px 0;
    padding: 2px 0;
    border-bottom: 1px solid #333;
  }

  .console-error {
    color: #ff6b6b;
  }

  .console-warn {
    color: #ffd93d;
  }

  .console-log {
    color: #4CAF50;
  }
`;

const EditorTitle = styled.div`
  background-color: #252526;
  color: white;
  padding: 6px 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #333;
  user-select: none;
  height: var(--editor-title-height);

  & > span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  & > span.settings {
    margin-left: auto;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 4px;
  overflow: hidden;
  min-height: 0;
  height: 100%;

  @media (max-width: 768px) {
    min-height: 200px;
  }
`;

const SplitPaneWrapper = styled.div`
  height: 100%;
  overflow: hidden;

  .SplitPane {
    height: 100% !important;
  }

  .Pane {
    height: 100% !important;
    overflow: hidden;
  }

  .Resizer {
    background: #333;
    opacity: 0.2;
    z-index: 1;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: 3px;

    &:hover {
      opacity: 1;
      transition: all 0.2s ease;
    }

    &.horizontal {
      height: 8px;
      margin: -4px 0;
      cursor: row-resize;
    }

    &.vertical {
      width: 8px;
      margin: 0 -4px;
      cursor: col-resize;
    }
  }
`;

const defaultHtmlCode = '';
const defaultCssCode = '';
const defaultJsCode = '';

const defaultSettings = {
  theme: 'vs-dark',
  fontSize: '14',
  fontWeight: 'normal',
  tabSize: '2',
  autoSave: 'off',
  layout: 'grid',
  panelOrder: 'html-css-js'
};

// Configure editor theme
monaco.editor.defineTheme('customTheme', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: '569CD6' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'operator', foreground: 'D4D4D4' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'type', foreground: '4EC9B0' }
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editorLineNumber.foreground': '#858585',
    'editorCursor.foreground': '#FFFFFF',
    'editor.selectionBackground': '#264F78',
    'editor.lineHighlightBackground': '#2D2D2D'
  }
});

function App() {
  const [authView, setAuthView] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [htmlCode, setHtmlCode] = useState(defaultHtmlCode);
  const [cssCode, setCssCode] = useState(defaultCssCode);
  const [jsCode, setJsCode] = useState(defaultJsCode);
  const [editorSizes, setEditorSizes] = useState([33, 33, 34]);
  const [previewSizes, setPreviewSizes] = useState([60, 40]); // For output preview vs console split
  const [verticalSizes, setVerticalSizes] = useState([70, 30]); // For editors vs preview split
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('editorSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Load saved code when user logs in
  useEffect(() => {
    if (currentUser) {
      const savedCode = localStorage.getItem(`code_${currentUser.email}`);
      if (savedCode) {
        const { html, css, js } = JSON.parse(savedCode);
        setHtmlCode(html || defaultHtmlCode);
        setCssCode(css || defaultCssCode);
        setJsCode(js || defaultJsCode);
      }
    }
  }, [currentUser]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleSignUp = (userData) => {
    // Here you would typically send the user data to your backend
    console.log('User registered:', userData);
    // For now, we'll just log them in with their data
    handleLogin(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    // Reset code to default
    setHtmlCode(defaultHtmlCode);
    setCssCode(defaultCssCode);
    setJsCode(defaultJsCode);
  };

  const saveCode = useCallback(() => {
    try {
      if (!currentUser) {
        alert('Please log in to save your code');
        return;
      }

      // Check if all code editors are empty
      const isAllEmpty = !htmlCode.trim() && !cssCode.trim() && !jsCode.trim();
      if (isAllEmpty) {
        alert('You have not written any code and cannot save an empty file.');
        return;
      }

      const codePackage = {
        html: htmlCode || '',
        css: cssCode || '',
        js: jsCode || '',
        lastSaved: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem(`code_${currentUser.email}`, JSON.stringify(codePackage));

      // Create a single combined HTML file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Saved Code - ${timestamp}</title>
  <style>
${cssCode}
  </style>
</head>
<body>
${htmlCode}
<script>
${jsCode}
</script>
</body>
</html>`;

      // Create a single file download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code_${timestamp}.html`;
      a.click();
      window.URL.revokeObjectURL(url);

      if (settings.autoSave !== 'afterDelay') {
        alert('Code saved successfully!');
      }
    } catch (error) {
      console.error('Error saving code:', error);
      alert('Error saving code. Please try again.');
    }
  }, [htmlCode, cssCode, jsCode, settings.autoSave, currentUser]);

  // Auto-save functionality
  useEffect(() => {
    if (settings.autoSave === 'afterDelay' && currentUser) {
      const timeoutId = setTimeout(saveCode, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [htmlCode, cssCode, jsCode, settings.autoSave, saveCode, currentUser]);

  const handleSwitchAuthView = () => {
    setAuthView(authView === 'login' ? 'signup' : 'login');
  };

  const updatePreview = () => {
    const previewFrame = document.getElementById('preview');
    const consoleOutput = document.getElementById('console-output');
    
    // Clear console
    if (consoleOutput) {
      consoleOutput.innerHTML = '<div class="console-line console-log"><pre style="margin: 0">Console ready. Write some JavaScript code to see output here.</pre></div>';
    }
    
    // Create the content with proper script setup
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
          <script>
            // Set up console logging first
            const originalConsole = window.console;
            const consoleProxy = {
              log: function(...args) {
                const message = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                originalConsole.log(...args);
                window.parent.postMessage({ type: 'log', content: message }, '*');
              },
              error: function(...args) {
                const message = args.map(arg => 
                  arg instanceof Error ? arg.stack || arg.message : 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                originalConsole.error(...args);
                window.parent.postMessage({ type: 'error', content: message }, '*');
              },
              warn: function(...args) {
                const message = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                originalConsole.warn(...args);
                window.parent.postMessage({ type: 'warn', content: message }, '*');
              }
            };

            window.console = consoleProxy;

            // Set up error handling
            window.onerror = function(msg, url, lineNo, columnNo, error) {
              console.error(error?.stack || \`Error: \${msg}\\nLine: \${lineNo}\\nColumn: \${columnNo}\`);
              return false;
            };

            window.addEventListener('error', function(event) {
              console.error(event.error?.stack || event.message);
              return false;
            });

            window.addEventListener('unhandledrejection', function(event) {
              console.error('Unhandled Promise Rejection:', event.reason);
            });
          </script>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              // Wrap in async IIFE to handle both sync and async errors
              (async function() {
                try {
                  ${jsCode}
                } catch (error) {
                  console.error(error);
                }
              })();
            } catch (error) {
              console.error(error);
            }
          </script>
        </body>
      </html>
    `;

    // Write content to the preview
    if (previewFrame) {
      const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
      preview.open();
      preview.write(content);
      preview.close();
    }
  };

  // Update the message event listener for console output
  useEffect(() => {
    const handleMessage = (event) => {
      const consoleOutput = document.getElementById('console-output');
      if (consoleOutput && event.data && event.data.type && event.data.content) {
        const line = document.createElement('div');
        line.className = `console-line console-${event.data.type}`;
        
        // Format the content
        let content = event.data.content;
        try {
          if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
            const parsed = JSON.parse(content);
            content = JSON.stringify(parsed, null, 2);
          }
        } catch (e) {
          // If parsing fails, use the content as is
        }
        
        // Create pre element for proper formatting
        const pre = document.createElement('pre');
        pre.style.margin = '0';
        pre.style.whiteSpace = 'pre-wrap';
        pre.textContent = content;
        
        line.appendChild(pre);
        consoleOutput.appendChild(line);
        
        // Auto-scroll to bottom
        requestAnimationFrame(() => {
          consoleOutput.scrollTop = consoleOutput.scrollHeight;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const resetCode = () => {
    setHtmlCode(defaultHtmlCode);
    setCssCode(defaultCssCode);
    setJsCode(defaultJsCode);
    
    // Clear the preview and console
    const previewFrame = document.getElementById('preview');
    const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    const consoleOutput = document.getElementById('console-output');
    
    preview.open();
    preview.write('');
    preview.close();
    
    if (consoleOutput) {
      consoleOutput.innerHTML = '';
    }
  };

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('editorSettings', JSON.stringify(newSettings));
  };

  const editorOptions = {
    fontSize: parseInt(settings.fontSize),
    tabSize: parseInt(settings.tabSize),
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    colorDecorators: true,
    fontWeight: settings.fontWeight,
    bracketPairColorization: {
      enabled: true,
    },
    guides: {
      bracketPairs: true,
      indentation: true,
      highlightActiveIndentation: true,
    },
    renderWhitespace: 'selection',
    suggest: {
      preview: true,
      showColors: true,
    },
    semanticHighlighting: {
      enabled: true
    },
    theme: 'customTheme'
  };

  const renderGridLayout = () => {
    const order = settings.panelOrder.split('-');
    const panels = {
      html: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#E44D26', borderRadius: '50%' }} />
              HTML
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="html"
            value={htmlCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setHtmlCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      ),
      css: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#264DE4', borderRadius: '50%' }} />
              CSS
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="css"
            value={cssCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setCssCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      ),
      js: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#F7DF1E', borderRadius: '50%' }} />
              JavaScript
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={jsCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setJsCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      )
    };

    return (
      <GridContainer>
        <SplitPane
          split="horizontal"
          sizes={verticalSizes}
          onChange={setVerticalSizes}
        >
          <EditorsGrid>
            <SplitPane
              split="vertical"
              sizes={editorSizes}
              onChange={setEditorSizes}
            >
              {order.map(panel => panels[panel])}
            </SplitPane>
          </EditorsGrid>
          <PreviewSection>
            <PreviewContent>
              <SplitPane
                split="vertical"
                sizes={previewSizes}
                onChange={setPreviewSizes}
              >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <EditorTitle>
                    <span>Output Preview</span>
                  </EditorTitle>
                  <div style={{ flex: 1, backgroundColor: 'white' }}>
                    <iframe
                      id="preview"
                      title="preview"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        border: 'none',
                        backgroundColor: "white" 
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <EditorTitle>
                    <span>Console</span>
                  </EditorTitle>
                  <ConsoleOutput id="console-output">
                    <div className="console-line console-log">
                      <pre style={{ margin: 0 }}>Console ready. Write some JavaScript code to see output here.</pre>
                    </div>
                  </ConsoleOutput>
                </div>
              </SplitPane>
            </PreviewContent>
          </PreviewSection>
        </SplitPane>
      </GridContainer>
    );
  };

  const getMobileLayout = () => {
    const order = settings.panelOrder.split('-');
    const editorPanels = {
      html: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#E44D26', borderRadius: '50%' }} />
              HTML
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="html"
            value={htmlCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setHtmlCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      ),
      css: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#264DE4', borderRadius: '50%' }} />
              CSS
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="css"
            value={cssCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setCssCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      ),
      js: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#F7DF1E', borderRadius: '50%' }} />
              JavaScript
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={jsCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setJsCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      )
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', overflow: 'auto' }}>
        {order.map(panel => editorPanels[panel])}
        <div style={{ minHeight: '200px' }}>
          <EditorTitle>
            <span>Output Preview</span>
          </EditorTitle>
          <div style={{ height: '200px', backgroundColor: 'white' }}>
            <iframe
              id="preview"
              title="preview"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
        <div style={{ minHeight: '150px' }}>
          <EditorTitle>
            <span>Console</span>
          </EditorTitle>
          <ConsoleOutput id="console-output" style={{ height: '150px' }}>
            <div className="console-line console-log">
              <pre style={{ margin: 0 }}>Console ready. Write some JavaScript code to see output here.</pre>
            </div>
          </ConsoleOutput>
        </div>
      </div>
    );
  };

  const getOrderedPanels = () => {
    // For mobile devices, return a simplified stacked layout
    if (window.innerWidth <= 768) {
      return [getMobileLayout()];
    }

    if (settings.layout === 'grid') {
      return [renderGridLayout()];
    }

    const editorPanels = {
      html: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#E44D26', borderRadius: '50%' }} />
              HTML
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="html"
            value={htmlCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setHtmlCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      ),
      css: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#264DE4', borderRadius: '50%' }} />
              CSS
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="css"
            value={cssCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setCssCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      ),
      js: (
        <EditorWrapper>
          <EditorTitle>
            <span>
              <div style={{ width: 12, height: 12, backgroundColor: '#F7DF1E', borderRadius: '50%' }} />
              JavaScript
            </span>
          </EditorTitle>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={jsCode}
            theme={settings.theme}
            options={editorOptions}
            onMount={updatePreview}
            onChange={value => {
              setJsCode(value);
              updatePreview();
            }}
          />
        </EditorWrapper>
      )
    };

    const order = settings.panelOrder.split('-');
    const editorSection = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
        {order.map(panel => editorPanels[panel])}
      </div>
    );

    const outputSection = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <SplitPane
            split="horizontal"
            sizes={previewSizes}
            onChange={setPreviewSizes}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <EditorTitle>
                <span>Output Preview</span>
              </EditorTitle>
              <div style={{ flex: 1, backgroundColor: 'white' }}>
                <iframe
                  id="preview"
                  title="preview"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    border: 'none',
                    backgroundColor: "white" 
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <EditorTitle>
                <span>Console</span>
              </EditorTitle>
              <ConsoleOutput id="console-output">
                <div className="console-line console-log">
                  <pre style={{ margin: 0 }}>Console ready. Write some JavaScript code to see output here.</pre>
                </div>
              </ConsoleOutput>
            </div>
          </SplitPane>
        </div>
      </div>
    );

    return settings.layout === 'horizontal' ? [editorSection, outputSection] : [
      <SplitPane
        split="vertical"
        sizes={[60, 40]}
        onChange={sizes => setEditorSizes(sizes)}
      >
        {editorSection}
        {outputSection}
      </SplitPane>
    ];
  };

  const renderToolbar = () => (
    <Toolbar>
      <Logo>
        <img src="/logo2.jpg" alt="Fanaven Technology" />
        <h3 style={{ color:'#6471e3', fontSize: '28px', fontWeight: 900 }}>
          Fanaven Technology <span style={{ color:'#fff', fontSize: '20px', fontWeight: 500 }}>Code Editor</span>
        </h3>
      </Logo>
      <ButtonGroup>
        <Button onClick={resetCode}>Reset</Button>
        <Button onClick={saveCode}>Save</Button>
        <Button onClick={() => setIsSettingsOpen(true)}>Settings</Button>
        <Button onClick={handleLogout}>Logout</Button>
      </ButtonGroup>
    </Toolbar>
  );

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on window resize
      setEditorSizes([...editorSizes]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editorSizes]);

  return (
    <AppContainer>
      {!isLoggedIn ? (
        authView === 'login' ? (
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignUp={() => setAuthView('signup')} 
          />
        ) : (
          <SignUp 
            onSignUp={handleSignUp} 
            onSwitchToLogin={() => setAuthView('login')} 
          />
        )
      ) : (
        <>
          {renderToolbar()}
          <EditorContainer>
            {settings.layout === 'grid' ? (
              renderGridLayout()
            ) : (
              <SplitPaneWrapper>
                <SplitPane
                  split="vertical"
                  sizes={[60, 40]}
                  onChange={setEditorSizes}
                >
                  {getOrderedPanels()}
                </SplitPane>
              </SplitPaneWrapper>
            )}
          </EditorContainer>
          <Settings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSave={handleSettingsSave}
          />
        </>
      )}
    </AppContainer>
  );
}

export default App; 