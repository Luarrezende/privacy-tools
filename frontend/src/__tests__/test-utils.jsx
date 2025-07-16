import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const BasicWrapper = ({ children }) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: BasicWrapper, ...options });

const renderWithoutProviders = (ui, options) =>
    render(ui, options);

const renderWithRouter = (ui, options) =>
    render(ui, { wrapper: BrowserRouter, ...options });

export * from '@testing-library/react';
export { customRender as render, renderWithoutProviders, renderWithRouter };
