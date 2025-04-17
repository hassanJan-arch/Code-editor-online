import React, { useState } from 'react';
import styled from 'styled-components';

const SignUpContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
`;

const SignUpCard = styled.div`
  background-color: #252526;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
  }
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ccc;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: #1e1e1e;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }

  &:invalid {
    border-color: #ff6b6b;
  }

  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    margin-top: 0.8rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const LinkText = styled.p`
  color: #ccc;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;

  a {
    color: #4CAF50;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PasswordRequirements = styled.ul`
  color: #ccc;
  font-size: 0.8rem;
  margin: 0.5rem 0;
  padding-left: 1.5rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin: 0.3rem 0;
    padding-left: 1.2rem;
  }

  li {
    margin: 0.2rem 0;
    &.valid {
      color: #4CAF50;
    }
    &.invalid {
      color: #ff6b6b;
    }
  }
`;

const SignUp = ({ onSignUp, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return requirements;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const passwordReqs = validatePassword(formData.password);
      if (!Object.values(passwordReqs).every(Boolean)) {
        throw new Error('Password does not meet requirements');
      }

      // Here you would typically make an API call to register
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSignUp(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = validatePassword(formData.password);

  return (
    <SignUpContainer>
      <SignUpCard>
        <Title>Create Account</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              minLength={3}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
            <PasswordRequirements>
              <li className={passwordRequirements.length ? 'valid' : 'invalid'}>
                At least 8 characters
              </li>
              <li className={passwordRequirements.uppercase ? 'valid' : 'invalid'}>
                One uppercase letter
              </li>
              <li className={passwordRequirements.lowercase ? 'valid' : 'invalid'}>
                One lowercase letter
              </li>
              <li className={passwordRequirements.number ? 'valid' : 'invalid'}>
                One number
              </li>
              <li className={passwordRequirements.special ? 'valid' : 'invalid'}>
                One special character (!@#$%^&*)
              </li>
            </PasswordRequirements>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Form>
        <LinkText>
          Already have an account? <a href="#" onClick={onSwitchToLogin}>Log In</a>
        </LinkText>
      </SignUpCard>
    </SignUpContainer>
  );
};

export default SignUp; 