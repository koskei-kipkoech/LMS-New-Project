import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TeacherSidebar from '../Teacher/sidebar';

function PerformanceTrend() {
    const [performanceData, setPerformanceData] = useState({
        results: [],
        trend_summary: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const token = localStorage.getItem('token');

                if (!userId || !token) {
                    throw new Error('Authentication required');
                }

                const response = await axios.get(`http://localhost:5000/api/student/results/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                

                setPerformanceData({
                    catResults: response.data.cat_results || [],
                    assignmentResults: response.data.assignment_results || [],
                    overallPerformance: response.data.overall_performance || [],
                    performanceTrend: response.data.performance_trend || []
                });
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch performance data');
                setLoading(false);
                console.error(err);
            }
        };

        fetchPerformanceData();
    }, []);

    const calculateTotalScore = (results) => {
        if (!results || results.length === 0) return 0;
        const total = results.reduce((sum, result) => sum + (result.score || 0), 0);
        return (total / results.length).toFixed(2);
    };

    if (loading) return <div className="text-center mt-5">Loading performance data...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <main className="col-md-10">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="mb-0">Student Performance Dashboard</h2>
                        </div>
                        <div className="card-body">
                            {/* Performance Summary */}
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header">CAT Average</div>
                                        <div className="card-body text-center">
                                            <h3>{calculateTotalScore(performanceData.catResults)}/20</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header">Assignment Average</div>
                                        <div className="card-body text-center">
                                            <h3>{calculateTotalScore(performanceData.assignmentResults)}/10</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header">Overall Performance</div>
                                        <div className="card-body text-center">
                                            <h3>{calculateTotalScore(performanceData.overallPerformance)}%</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CAT Results Section */}
                            <section className="mb-4">
                                <h3>CAT Results</h3>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Unit</th>
                                            <th>CAT Score</th>
                                            <th>Max Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {performanceData.catResults.map((result, index) => (
                                            <tr key={index}>
                                                <td>{result.unit_title}</td>
                                                <td>{result.cat_score || 'N/A'}</td>
                                                <td>20</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>

                            {/* Assignment Results Section */}
                            <section className="mb-4">
                                <h3>Assignment Results</h3>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Assignment</th>
                                            <th>Score</th>
                                            <th>Max Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {performanceData.assignmentResults.map((result, index) => (
                                            <tr key={index}>
                                                <td>{result.assignment_title}</td>
                                                <td>{result.score || 'N/A'}</td>
                                                <td>10</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>

                            {/* Performance Trend Graph */}
                            <section className="mb-4">
                                <h3>Performance Trend</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart 
                                        data={performanceData.performanceTrend}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="timestamp" 
                                            tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                                        />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip 
                                            labelFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="#8884d8" 
                                            activeDot={{ r: 8 }} 
                                            name="Performance Score"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </section>

                            {/* Overall Performance Section */}
                            <section>
                                <h3>Overall Performance by Unit</h3>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Unit</th>
                                            <th>Performance Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {performanceData.overallPerformance.map((perf, index) => (
                                            <tr key={index}>
                                                <td>{perf.unit_title}</td>
                                                <td>{perf.score || 'N/A'}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default PerformanceTrend;