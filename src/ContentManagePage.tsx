import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonWallet } from '@tonconnect/ui-react';

interface Content {
    id: number;
    title: string;
    url: string;
    description: string;
    thumbnail: string;
    visible: boolean;
    totalEarned: number;
    contentPayUrl: string;
}

const MAX_DESCRIPTION_LENGTH = 300;

const ContentManagePage: React.FC = () => {
    const navigate = useNavigate();
    const wallet = useTonWallet();
    const [contents, setContents] = useState<Content[]>([]);
    const [newContent, setNewContent] = useState<Partial<Content>>({
        title: '',
        url: '',
        description: '',
        thumbnail: '',
    });
    const [editContentId, setEditContentId] = useState<number | null>(null);
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    useEffect(() => {
        const storedContents = localStorage.getItem('contents');
        if (storedContents) {
            setContents(JSON.parse(storedContents));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('contents', JSON.stringify(contents));
    }, [contents]);

    if (!wallet) {
        return (
            <div>
                <h2>Content Management</h2>
                <p>Please connect your wallet to manage your content.</p>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
            return;
        }
        setNewContent((prevContent) => ({
            ...prevContent,
            [name]: name === 'description' ? value.slice(0, MAX_DESCRIPTION_LENGTH) : value,
        }));
        if (name === 'description') {
            setDescriptionLength(value.length);
        }
    };

    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
                setNewContent((prevContent) => ({
                    ...prevContent,
                    thumbnail: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddContent = () => {
        if (newContent.title && newContent.url) {
            if (editContentId !== null) {
                setContents((prevContents) =>
                    prevContents.map((content) =>
                        content.id === editContentId
                            ? {
                                  ...content,
                                  title: newContent.title!,
                                  url: newContent.url!,
                                  description: newContent.description || '',
                                  thumbnail: newContent.thumbnail || '',
                                  contentPayUrl: `https://contentPay.online/${content.id}`,
                              }
                            : content
                    )
                );
                setEditContentId(null);
            } else {
                const newId = Date.now();
                setContents((prevContents) => [
                    ...prevContents,
                    {
                        id: newId,
                        title: newContent.title!,
                        url: newContent.url!,
                        description: newContent.description || '',
                        thumbnail: newContent.thumbnail || '',
                        visible: true,
                        totalEarned: 0,
                        contentPayUrl: `https://contentPay.online/${newId}`,
                    },
                ]);
            }
            setNewContent({
                title: '',
                url: '',
                description: '',
                thumbnail: '',
            });
            setThumbnailPreview(null);
            setDescriptionLength(0);
        } else {
            alert('Please fill in the title and URL.');
        }
    };

    const handleDeleteContent = (id: number) => {
        setContents((prevContents) => prevContents.filter((content) => content.id !== id));
    };

    const handleToggleVisibility = (id: number) => {
        setContents((prevContents) =>
            prevContents.map((content) =>
                content.id === id ? { ...content, visible: !content.visible } : content
            )
        );
    };

    const handleEditContent = (id: number) => {
        const selectedContent = contents.find((content) => content.id === id);
        if (selectedContent) {
            setEditContentId(id);
            setNewContent({
                title: selectedContent.title,
                url: selectedContent.url,
                description: selectedContent.description,
                thumbnail: selectedContent.thumbnail,
            });
            setThumbnailPreview(selectedContent.thumbnail);
            setDescriptionLength(selectedContent.description.length);
        }
    };

    return (
        <div className="content-management-page">
            <h2>Manage Your Content</h2>
            <div className="new-content-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newContent.title}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="url"
                    placeholder="URL"
                    value={newContent.url}
                    onChange={handleInputChange}
                />
                <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                {thumbnailPreview && (
                    <div className='preview'>
                        <img className='content-image-preview' src={thumbnailPreview} alt="Thumbnail Preview" />
                    </div>
                )}
                <textarea
                    name="description"
                    placeholder="Description"
                    value={newContent.description}
                    onChange={handleInputChange}
                />
                {descriptionLength > MAX_DESCRIPTION_LENGTH && (
                    <p style={{ color: 'red' }}>Maximum characters exceeded!</p>
                )}
                <p>Characters remaining: {MAX_DESCRIPTION_LENGTH - descriptionLength}</p>
                
                <button onClick={handleAddContent}>{editContentId !== null ? 'Save Content' : 'Add Content'}</button>
            </div>
            {contents.length > 0 ? (
                <div className="content-list">
                    {contents.map((content) => (
                        <div key={content.id} className="content-card">
                            <h3>{content.title}</h3>
                            <p>{content.description}</p>
                            <a href={content.url}><strong className='url'>Content URL:</strong> {content.url}</a>
                            <div className="contentpay-url">
                                <a href={content.contentPayUrl}><strong className='url'>ContentPay URL:</strong> {content.contentPayUrl}</a>
                            </div>
                            {content.thumbnail && <img className='content-card-img' src={content.thumbnail} alt={content.title} />}
                            <p><strong>Total earned:</strong>  <span className='total-earned'>{content.totalEarned} TON</span> </p>
                            <div className="content-actions">
                                <button onClick={() => handleEditContent(content.id)}>Edit</button>
                                <button onClick={() => handleDeleteContent(content.id)}>Delete</button>
                                <label>
                                    available for donation
                                    <input
                                        type="checkbox"
                                        checked={content.visible}
                                        onChange={() => handleToggleVisibility(content.id)}
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No content available.</p>
            )}
            <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
    );
};

export default ContentManagePage;
